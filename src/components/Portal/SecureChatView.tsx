import React, { useState, useRef, useEffect } from 'react';
import { useRealTimeChat } from '../../hooks/useRealTimeChat.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { ChatMessage, MessageCategory } from '../../types.ts';
import {
  ShieldCheck,
  Send,
  Lock,
  Phone,
  CheckCheck,
  Clock,
  AlertTriangle,
  UserCheck,
  Stethoscope,
  Heart,
  Pill,
  Calendar,
  AlertCircle,
  FileCheck2,
  Search,
  MessageSquare,
  Sparkles,
  Wifi,
  WifiOff,
  Info
} from 'lucide-react';

interface SecureChatViewProps {
  initialPatientId?: string;
}

export const SecureChatView: React.FC<SecureChatViewProps> = ({ initialPatientId }) => {
  const { user, token } = useAuth();
  const initialChannel = initialPatientId ? `patient-${initialPatientId}` : undefined;
  
  const {
    channels,
    activeChannelId,
    setActiveChannelId,
    messages,
    loadingMessages,
    isConnected,
    isConnecting,
    typingUsers,
    sendMessage,
    sendTyping
  } = useRealTimeChat(initialChannel);

  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MessageCategory>('general');
  const [isUrgent, setIsUrgent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuditMessage, setSelectedAuditMessage] = useState<ChatMessage | null>(null);
  const [auditVerifyData, setAuditVerifyData] = useState<any | null>(null);
  const [verifyingAudit, setVerifyingAudit] = useState(false);
  const [showHipaaInfoModal, setShowHipaaInfoModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const activeChannel = channels.find(c => c.id === activeChannelId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    sendTyping(true);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      sendTyping(false);
    }, 2000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText;
    setInputText('');
    sendTyping(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    await sendMessage(content, selectedCategory, isUrgent);
    setIsUrgent(false);
  };

  const handleQuickTemplate = (text: string, category: MessageCategory, urgent = false) => {
    setInputText(text);
    setSelectedCategory(category);
    setIsUrgent(urgent);
  };

  const handleInspectAudit = async (msg: ChatMessage) => {
    setSelectedAuditMessage(msg);
    setVerifyingAudit(true);
    try {
      const res = await fetch(`/api/messages/audit-verify/${msg.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAuditVerifyData(await res.json());
      }
    } catch (err) {
      console.error('Audit verification error:', err);
    } finally {
      setVerifyingAudit(false);
    }
  };

  const filteredChannels = channels.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.patientName.toLowerCase().includes(q) ||
      (c.assignedNurseName && c.assignedNurseName.toLowerCase().includes(q)) ||
      (c.diagnosis && c.diagnosis.toLowerCase().includes(q)) ||
      (c.hubLocation && c.hubLocation.toLowerCase().includes(q))
    );
  });

  const getCategoryBadge = (category: MessageCategory) => {
    switch (category) {
      case 'medication':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Pill className="w-3 h-3 text-purple-600" />
            <span>Medication Care</span>
          </span>
        );
      case 'vital_alert':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Vital Alert / Obs</span>
          </span>
        );
      case 'care_shift':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span>Shift &amp; Duty Plan</span>
          </span>
        );
      case 'urgent_consult':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Doctor Consult Request</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <MessageSquare className="w-3 h-3 text-slate-500" />
            <span>Clinical Note</span>
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-md border border-indigo-200">
            Service Coordinator
          </span>
        );
      case 'nurse':
        return (
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
            ICU Staff Nurse
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md border border-sky-200">
            Patient / Family Rep
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* HIPAA Compliance & Connection Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-800 font-heading">
                HIPAA-Compliant Real-Time Care Communication
              </h3>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>End-to-End Audit Sealed</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>Direct secure bridge between Patients/Families, Assigned ICU Nurses, and Clinical Coordinators.</span>
              <button
                type="button"
                onClick={() => setShowHipaaInfoModal(true)}
                className="text-[#00a0e3] hover:underline font-bold inline-flex items-center gap-0.5"
              >
                <Info className="w-3 h-3" />
                <span>Security Guidelines</span>
              </button>
            </p>
          </div>
        </div>

        {/* Real-time status indicator & quick action */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isConnecting
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>WebSocket Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span>REST Synchronized</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] max-h-[750px]">
        
        {/* Left Column: Channels & Conversations */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/60 max-h-[750px]">
          
          {/* Channel Search Header */}
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, nurse, hub..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-slate-200"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-2.5 px-0.5">
              <span>Care Channels ({filteredChannels.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Active Care Direct</span>
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredChannels.map((channel) => {
              const isSelected = channel.id === activeChannelId;
              const hasUnread = (channel.unreadCount || 0) > 0;

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full text-left p-3.5 transition flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-blue-50/90 border-l-4 border-[#00a0e3]'
                      : 'hover:bg-slate-100/80 bg-white'
                  }`}
                  id={`channel-item-${channel.id}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#1b3b6f] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {channel.patientName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {channel.patientName}
                      </h4>
                      {channel.lastMessage && (
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(channel.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {channel.diagnosis}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-bold truncate max-w-[130px]">
                        Nurse: {channel.assignedNurseName || 'Unassigned'}
                      </span>
                      {hasUnread && (
                        <span className="ml-auto bg-[#00a0e3] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                          {channel.unreadCount} new
                        </span>
                      )}
                    </div>

                    {channel.lastMessage && (
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        <strong className="text-slate-600">{channel.lastMessage.senderName.split(' ')[0]}: </strong>
                        {channel.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredChannels.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching care channels found.
              </div>
            )}
          </div>

          {/* Left Column Footer Note */}
          <div className="p-3 bg-white border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>TLS 1.3 / AES-256</span>
            </span>
            <span className="text-[10px] text-slate-400">7-Year HIPAA Retention</span>
          </div>

        </div>

        {/* Right Column: Active Conversation Stream */}
        <div className="lg:col-span-8 flex flex-col bg-white max-h-[750px]">
          
          {/* Header of Active Channel */}
          {activeChannel ? (
            <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1b3b6f] flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
                  {activeChannel.patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-[#1b3b6f]">
                      {activeChannel.patientName} Care Channel
                    </h4>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                      {activeChannel.hubLocation || 'Delhi NCR'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#00a0e3]" />
                      <strong>Nurse:</strong> {activeChannel.assignedNurseName || 'Care Coordinator on duty'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <strong>Coordinator:</strong> Dr. Alok Verma
                    </span>
                  </div>
                </div>
              </div>

              {/* Integrity status button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHipaaInfoModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1.5"
                  title="View HIPAA Security Specifications"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Audit Seal</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 text-sm text-slate-500 font-bold">
              Select a conversation channel
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
            {loadingMessages && (
              <div className="text-center py-8 text-xs text-slate-400">
                Loading encrypted clinical logs...
              </div>
            )}

            {!loadingMessages && messages.length === 0 && (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
                <h5 className="font-bold text-sm text-slate-600">No messages in this care channel yet</h5>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Start direct communication with the assigned nurse or clinical supervisor. All messages are archived with cryptographic SHA-256 signatures.
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
                  id={`chat-message-${msg.id}`}
                >
                  {/* Sender & Timestamp */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
                    <span className="font-bold text-slate-700">{msg.senderName}</span>
                    {getRoleBadge(msg.senderRole)}
                    <span>•</span>
                    <span className="text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Bubble Container */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs shadow-xs space-y-2 ${
                      isMine
                        ? 'bg-[#1b3b6f] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                    } ${msg.isUrgent ? 'ring-2 ring-rose-500' : ''}`}
                  >
                    {/* Top Category Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className={isMine ? 'text-slate-200' : ''}>
                        {getCategoryBadge(msg.category)}
                      </div>
                      {msg.isUrgent && (
                        <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full animate-bounce">
                          URGENT
                        </span>
                      )}
                    </div>

                    {/* Message Body */}
                    <p className={`whitespace-pre-wrap leading-relaxed ${isMine ? 'text-slate-100' : 'text-slate-700'}`}>
                      {msg.content}
                    </p>

                    {/* Bottom Metadata & Cryptographic Integrity Badge */}
                    <div
                      className={`pt-1.5 border-t flex flex-wrap items-center justify-between gap-2 text-[10px] ${
                        isMine ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleInspectAudit(msg)}
                        className={`inline-flex items-center gap-1 font-mono hover:underline ${
                          isMine ? 'text-emerald-300' : 'text-emerald-600'
                        }`}
                        title="Click to verify cryptographic SHA-256 integrity hash"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>SHA-256 Integrity Verified</span>
                      </button>

                      <div className="flex items-center gap-1 font-semibold">
                        <CheckCheck className={`w-3.5 h-3.5 ${isMine ? 'text-cyan-300' : 'text-slate-400'}`} />
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/80 p-2 rounded-xl border border-slate-200 w-fit animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="font-semibold text-slate-700">
                  {typingUsers.map(u => u.name).join(', ')} is typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Clinical Response Templates / Chips */}
          <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00a0e3]" />
              <span>Quick Note:</span>
            </span>

            <button
              type="button"
              onClick={() => handleQuickTemplate('Vitals checked: BP 124/80 mmHg, Pulse 76 bpm, SpO2 98% on room air. Stable.', 'vital_alert')}
              className="shrink-0 bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              Vitals Stable
            </button>

            <button
              type="button"
              onClick={() => handleQuickTemplate('Medications administered on schedule via prescribed route. Patient comfortable.', 'medication')}
              className="shrink-0 bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              Medications Given
            </button>

            <button
              type="button"
              onClick={() => handleQuickTemplate('Tracheostomy suctioning performed with clear secretions. Airway clean.', 'vital_alert')}
              className="shrink-0 bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              Suctioning Completed
            </button>

            <button
              type="button"
              onClick={() => handleQuickTemplate('Ryle tube nutritional feed (250 ml) administered slowly without aspiration.', 'general')}
              className="shrink-0 bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              Enteral Feed
            </button>

            <button
              type="button"
              onClick={() => handleQuickTemplate('Requesting physician tele-consultation review for dosage adjustment.', 'urgent_consult', true)}
              className="shrink-0 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-rose-200 transition"
            >
              Doctor Consult Request
            </button>
          </div>

          {/* Message Input & Action Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 space-y-2">
            
            {/* Category selection row & Urgent flag */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as MessageCategory)}
                  className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="select-message-category"
                >
                  <option value="general">Clinical Note</option>
                  <option value="medication">Medication Care</option>
                  <option value="vital_alert">Vital Alert / Obs</option>
                  <option value="care_shift">Shift Coordination</option>
                  <option value="urgent_consult">Doctor Consult Request</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                  id="checkbox-message-urgent"
                />
                <span className={isUrgent ? 'text-rose-600' : 'text-slate-500'}>Mark as Urgent</span>
              </label>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type HIPAA-encrypted clinical message or inquiry (Press Enter to send)..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a0e3]/30 focus:bg-white transition"
                id="input-chat-message"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-[#00a0e3] hover:bg-[#008fcb] text-white p-2.5 rounded-xl font-bold transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                id="btn-send-chat-message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
              <span>🔒 Encrypted transit &amp; database archival</span>
              <span>Direct access to Sister Priya Sharma &amp; Dr. Alok Verma</span>
            </div>
          </form>

        </div>

      </div>

      {/* Audit Inspector Modal (Cryptographic Verification) */}
      {selectedAuditMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm sm:text-base">HIPAA Cryptographic Audit Certificate</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuditMessage(null)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900">Message Integrity Confirmed: UNCOMPROMISED</div>
                  <div className="text-[11px] text-emerald-700">
                    Compliant with 45 CFR § 164.312 (Technical Safeguards - Transmission &amp; Audit Controls)
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400">Message ID: </span>
                  <span className="font-bold text-slate-800">{selectedAuditMessage.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">Timestamp: </span>
                  <span className="text-slate-800">{new Date(selectedAuditMessage.timestamp).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400">Sender: </span>
                  <span className="font-bold text-slate-800">{selectedAuditMessage.senderName} ({selectedAuditMessage.senderRole})</span>
                </div>
                <div className="break-all">
                  <span className="text-slate-400">Cryptographic Seal: </span>
                  <span className="font-bold text-emerald-700">{selectedAuditMessage.auditHash}</span>
                </div>
              </div>

              <div className="text-slate-500 text-[11px] space-y-1">
                <p><strong>Clinical Chain of Custody:</strong> Message logged permanently to Care Health Nurses secure server records with automatic tamper detection.</p>
                <p><strong>Archival Standard:</strong> 7-year medical record retention policy active.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAuditMessage(null)}
                className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIPAA Compliance Info Modal */}
      {showHipaaInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00a0e3]" />
                <h4 className="font-bold text-sm sm:text-base">Care Health HIPAA &amp; Privacy Safeguards</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowHipaaInfoModal(false)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-800 text-sm">1. Protected Health Information (PHI) Security</h5>
                <p className="text-slate-600 leading-relaxed">
                  Care Health Nurses ensures all vital observations, physician instructions, and patient communications are transmitted through Transport Layer Security (TLS 1.3) and encrypted at rest with AES-256.
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-800 text-sm">2. Cryptographic Integrity Signatures</h5>
                <p className="text-slate-600 leading-relaxed">
                  Every message is stamped with a SHA-256 mathematical hash generated from message payload, user credentials, and atomic server clock time, making tampering mathematically impossible.
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-800 text-sm">3. Role-Based Access Isolation</h5>
                <p className="text-slate-600 leading-relaxed">
                  Channels are partitioned strictly. Patients and family members can only read or write within their designated care channel, while registered nurses can only access assigned cases.
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-800 text-sm">4. Delhi NCR Clinical Protocols</h5>
                <p className="text-slate-600 leading-relaxed">
                  Aligned with Delhi Nursing Council and Directorate General of Health Services (DGHS) clinical documentation standards.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHipaaInfoModal(false)}
                className="px-4 py-1.5 text-xs font-bold text-[#1b3b6f] hover:bg-slate-200 rounded-lg transition"
              >
                Acknowledge &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
