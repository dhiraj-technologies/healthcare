import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { ChatMessage, ChatChannel, MessageCategory } from '../types.ts';

export function useRealTimeChat(initialChannelId?: string) {
  const { user, token } = useAuth();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>(initialChannelId || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<{ id: string; name: string; role: string }[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch channels list
  const fetchChannels = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/messages/channels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data: ChatChannel[] = await res.json();
        setChannels(data);

        // If no active channel selected, default to first accessible channel
        setActiveChannelId(prev => {
          if (prev && data.some(c => c.id === prev)) return prev;
          if (data.length > 0) return data[0].id;
          return '';
        });
      }
    } catch (err) {
      console.error('Error fetching chat channels:', err);
    }
  }, [token]);

  // Fetch messages for a specific channel via REST
  const fetchChannelMessages = useCallback(async (channelId: string) => {
    if (!token || !channelId) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages/channel/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(`Error fetching messages for ${channelId}:`, err);
    } finally {
      setLoadingMessages(false);
    }
  }, [token]);

  // Connect WebSocket
  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const connectWebSocket = () => {
      if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      setIsConnecting(true);
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setIsConnecting(false);

          // Authenticate session over WebSocket
          ws.send(JSON.stringify({
            type: 'auth',
            token,
            initialChannelId: activeChannelId
          }));
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            switch (data.type) {
              case 'auth_success':
                // Subscribe to active channel if present
                if (activeChannelId) {
                  ws.send(JSON.stringify({ type: 'subscribe', channelId: activeChannelId }));
                }
                break;

              case 'subscribed':
                if (data.channelId === activeChannelId && Array.isArray(data.messages)) {
                  setMessages(data.messages);
                }
                break;

              case 'new_message': {
                const newMsg: ChatMessage = data.message;
                // If it belongs to our active channel, append idempotently
                if (newMsg.channelId === activeChannelId) {
                  setMessages(prev => {
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                  });
                }

                // Update channel last message & unread status
                setChannels(prev => prev.map(ch => {
                  if (ch.id === newMsg.channelId) {
                    const isForActiveView = newMsg.channelId === activeChannelId;
                    return {
                      ...ch,
                      lastMessage: newMsg,
                      unreadCount: isForActiveView ? 0 : (ch.unreadCount || 0) + 1
                    };
                  }
                  return ch;
                }));
                break;
              }

              case 'user_typing': {
                if (data.channelId === activeChannelId) {
                  const typingUser = data.user;
                  if (data.isTyping) {
                    setTypingUsers(prev => {
                      if (prev.some(u => u.id === typingUser.id)) return prev;
                      return [...prev, typingUser];
                    });

                    // Clear timeout if exists and set fresh 3-second expiry
                    if (typingTimeoutRef.current[typingUser.id]) {
                      clearTimeout(typingTimeoutRef.current[typingUser.id]);
                    }
                    typingTimeoutRef.current[typingUser.id] = setTimeout(() => {
                      setTypingUsers(prev => prev.filter(u => u.id !== typingUser.id));
                    }, 3500);
                  } else {
                    setTypingUsers(prev => prev.filter(u => u.id !== typingUser.id));
                  }
                }
                break;
              }

              case 'messages_read':
                // Someone read messages in channel
                break;
            }
          } catch (e) {
            console.error('Error handling WebSocket message:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          setIsConnecting(false);
          socketRef.current = null;

          // Attempt reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted && token) {
              connectWebSocket();
            }
          }, 3000);
        };

        ws.onerror = (err) => {
          console.warn('WebSocket connection error, falling back to REST sync:', err);
        };
      } catch (err) {
        console.error('WebSocket creation error:', err);
        setIsConnected(false);
        setIsConnecting(false);
      }
    };

    connectWebSocket();
    fetchChannels();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      Object.values(typingTimeoutRef.current).forEach(t => clearTimeout(t));
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token, fetchChannels]);

  // When activeChannelId changes, subscribe via WS and fetch fresh via REST
  useEffect(() => {
    if (!activeChannelId) return;

    fetchChannelMessages(activeChannelId);
    setTypingUsers([]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'subscribe',
        channelId: activeChannelId
      }));
      socketRef.current.send(JSON.stringify({
        type: 'mark_read',
        channelId: activeChannelId
      }));
    }

    // Reset unread count for active channel locally
    setChannels(prev => prev.map(ch => ch.id === activeChannelId ? { ...ch, unreadCount: 0 } : ch));
  }, [activeChannelId, fetchChannelMessages]);

  // Send message
  const sendMessage = async (content: string, category: MessageCategory = 'general', isUrgent = false) => {
    if (!content.trim() || !activeChannelId) return false;

    // First try WebSocket
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'send_message',
        channelId: activeChannelId,
        content: content.trim(),
        category,
        isUrgent
      }));
      return true;
    }

    // Fallback to REST API if WebSocket is offline
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          channelId: activeChannelId,
          content: content.trim(),
          category,
          isUrgent
        })
      });

      if (res.ok) {
        const newMsg: ChatMessage = await res.json();
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        return true;
      }
    } catch (err) {
      console.error('Failed to send message via REST fallback:', err);
    }
    return false;
  };

  // Send typing indicator
  const sendTyping = (isTyping: boolean) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && activeChannelId) {
      ws.send(JSON.stringify({
        type: 'typing',
        channelId: activeChannelId,
        isTyping
      }));
    }
  };

  return {
    channels,
    activeChannelId,
    setActiveChannelId,
    messages,
    loadingMessages,
    isConnected,
    isConnecting,
    typingUsers,
    sendMessage,
    sendTyping,
    refreshChannels: fetchChannels,
    refreshMessages: () => fetchChannelMessages(activeChannelId)
  };
}
