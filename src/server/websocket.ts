import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET, AuthTokenPayload } from './auth.js';
import { db } from './db.js';
import { ChatMessage, MessageCategory } from '../types.js';

export interface CustomWebSocket extends WebSocket {
  isAlive?: boolean;
  user?: AuthTokenPayload;
  subscribedChannels?: Set<string>;
}

let wss: WebSocketServer | null = null;

export function initWebSocketServer(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server, path: '/api/ws' });

  wss.on('connection', (ws: CustomWebSocket, req) => {
    ws.isAlive = true;
    ws.subscribedChannels = new Set<string>();

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (data) => {
      try {
        const raw = data.toString();
        const payload = JSON.parse(raw);
        handleClientMessage(ws, payload);
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
        ws.send(JSON.stringify({ type: 'error', message: 'Malformed JSON payload' }));
      }
    });

    ws.on('close', () => {
      // Clean up subscriptions
      if (ws.subscribedChannels) {
        ws.subscribedChannels.clear();
      }
    });

    ws.on('error', (err) => {
      console.warn('WebSocket client error:', err);
    });

    // Send initial connected ping
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Care Health Nurses HIPAA-Compliant Secure Real-Time Messaging Server',
      timestamp: new Date().toISOString()
    }));
  });

  // Heartbeat to clear dead connections
  const interval = setInterval(() => {
    if (!wss) return;
    wss.clients.forEach((client) => {
      const customWs = client as CustomWebSocket;
      if (customWs.isAlive === false) {
        return customWs.terminate();
      }
      customWs.isAlive = false;
      customWs.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
}

function handleClientMessage(ws: CustomWebSocket, payload: any) {
  const { type } = payload;

  switch (type) {
    case 'auth': {
      const { token, initialChannelId } = payload;
      if (!token) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'Token required' }));
        return;
      }
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
        ws.user = decoded;
        ws.send(JSON.stringify({
          type: 'auth_success',
          user: {
            id: decoded.userId,
            name: decoded.name,
            role: decoded.role,
            patientId: decoded.patientId,
            nurseId: decoded.nurseId
          }
        }));

        // If client requested an initial channel subscription upon auth
        if (initialChannelId) {
          subscribeToChannel(ws, initialChannelId);
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid or expired token' }));
      }
      break;
    }

    case 'subscribe': {
      const { channelId } = payload;
      if (!channelId) return;
      subscribeToChannel(ws, channelId);
      break;
    }

    case 'unsubscribe': {
      const { channelId } = payload;
      if (channelId && ws.subscribedChannels) {
        ws.subscribedChannels.delete(channelId);
        ws.send(JSON.stringify({ type: 'unsubscribed', channelId }));
      }
      break;
    }

    case 'send_message': {
      if (!ws.user) {
        ws.send(JSON.stringify({ type: 'error', message: 'Authentication required to post message' }));
        return;
      }
      const { channelId, content, category = 'general', isUrgent = false } = payload;
      if (!channelId || !content || typeof content !== 'string' || !content.trim()) {
        ws.send(JSON.stringify({ type: 'error', message: 'channelId and content are required' }));
        return;
      }

      // Check authorization for channel
      if (!canAccessChannel(ws.user, channelId)) {
        ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized to post to this patient channel' }));
        return;
      }

      const patientId = channelId.startsWith('patient-') ? channelId.replace('patient-', '') : channelId;
      const timestamp = new Date().toISOString();
      const auditHash = 'sha256:' + crypto.createHash('sha256')
        .update(`${content.trim()}|${ws.user.userId}|${timestamp}|${channelId}`)
        .digest('hex');

      const userDb = db.getUserById(ws.user.userId);
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        channelId,
        patientId,
        senderId: ws.user.userId,
        senderName: ws.user.name,
        senderRole: ws.user.role,
        senderAvatar: userDb?.avatar,
        recipientRole: 'all',
        content: content.trim(),
        category: (category as MessageCategory) || 'general',
        timestamp,
        auditHash,
        isReadBy: [ws.user.userId],
        isUrgent: Boolean(isUrgent)
      };

      db.createMessage(newMsg);
      broadcastNewMessage(newMsg);
      break;
    }

    case 'typing': {
      if (!ws.user) return;
      const { channelId, isTyping } = payload;
      if (!channelId) return;

      broadcastToChannel(channelId, {
        type: 'user_typing',
        channelId,
        user: {
          id: ws.user.userId,
          name: ws.user.name,
          role: ws.user.role
        },
        isTyping: Boolean(isTyping)
      }, ws);
      break;
    }

    case 'mark_read': {
      if (!ws.user) return;
      const { channelId, messageId } = payload;
      if (messageId) {
        db.markMessageRead(messageId, ws.user.userId);
      } else if (channelId) {
        db.markChannelRead(channelId, ws.user.userId);
      }

      if (channelId) {
        broadcastToChannel(channelId, {
          type: 'messages_read',
          channelId,
          userId: ws.user.userId
        });
      }
      break;
    }

    default:
      ws.send(JSON.stringify({ type: 'unknown_command', received: type }));
  }
}

function canAccessChannel(user: AuthTokenPayload, channelId: string): boolean {
  if (user.role === 'admin') return true;
  if (user.role === 'nurse') return true; // Nurses collaborate across clinical patient care
  if (user.role === 'patient') {
    // Patient or family rep can only access their patient channel
    const targetPatientId = channelId.startsWith('patient-') ? channelId.replace('patient-', '') : channelId;
    return user.patientId === targetPatientId;
  }
  return false;
}

function subscribeToChannel(ws: CustomWebSocket, channelId: string) {
  if (!ws.user) {
    ws.send(JSON.stringify({ type: 'error', message: 'Please authenticate before subscribing to clinical channel' }));
    return;
  }

  if (!canAccessChannel(ws.user, channelId)) {
    ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized access to this patient communication channel' }));
    return;
  }

  if (!ws.subscribedChannels) {
    ws.subscribedChannels = new Set<string>();
  }
  ws.subscribedChannels.add(channelId);

  // Send channel message history upon subscription
  const messages = db.getMessages(channelId);
  ws.send(JSON.stringify({
    type: 'subscribed',
    channelId,
    messages
  }));
}

export function broadcastNewMessage(message: ChatMessage) {
  if (!wss) return;

  const payload = JSON.stringify({
    type: 'new_message',
    channelId: message.channelId,
    message
  });

  wss.clients.forEach((client) => {
    const customWs = client as CustomWebSocket;
    if (customWs.readyState === WebSocket.OPEN && customWs.subscribedChannels?.has(message.channelId)) {
      customWs.send(payload);
    }
  });
}

function broadcastToChannel(channelId: string, data: any, excludeWs?: CustomWebSocket) {
  if (!wss) return;

  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    const customWs = client as CustomWebSocket;
    if (customWs !== excludeWs && customWs.readyState === WebSocket.OPEN && customWs.subscribedChannels?.has(channelId)) {
      customWs.send(payload);
    }
  });
}
