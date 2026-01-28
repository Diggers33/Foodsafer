import { ArrowLeft, Send, Paperclip, Image as ImageIcon, Phone, Video, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { api } from '@/api';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    organization: string;
    online: boolean;
  };
  messages: Message[];
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function mapConversation(c: any, currentUserId: string): Conversation {
  const participant = c.participant || c.otherUser || c.user || {};
  const avatar = participant.avatar ? (participant.avatar.startsWith('http') ? participant.avatar : `${API_BASE}${participant.avatar}`) : '';
  const participantName = `${participant.firstName || ''} ${participant.lastName || ''}`.trim() || participant.name || 'Unknown';

  const msgs = (c.messages || []).map((m: any) => ({
    id: m.id,
    senderId: m.senderId || m.sender?.id || m.userId,
    text: m.text || m.content || m.message || '',
    timestamp: m.createdAt || m.timestamp || '',
    isCurrentUser: (m.senderId || m.sender?.id || m.userId) === currentUserId || m.isCurrentUser || m.isMine,
  }));

  return {
    id: c.id,
    participant: {
      name: participantName,
      avatar,
      organization: participant.organization || participant.company || '',
      online: participant.online ?? participant.isOnline ?? false,
    },
    messages: msgs,
  };
}

export function MessageThread({ conversationId, onBack }: { conversationId: string; onBack: () => void }) {
  const [messageText, setMessageText] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  const fetchConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get current user ID from localStorage token or profile
      let currentUserId = '';
      try {
        const profileData = await api.get<any>('/queries/users/me');
        currentUserId = profileData.id || '';
      } catch {
        // Continue without current user ID
      }

      const data = await api.get<any>(`/queries/conversations/${conversationId}`);
      const mappedConv = mapConversation(data, currentUserId);
      setConversation(mappedConv);
      setMessages(mappedConv.messages);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        senderId: 'me',
        text: messageText,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    let date: Date;
    const ddmmyyyyMatch = timestamp.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (ddmmyyyyMatch) {
      const [, day, month, year, hour, min, sec] = ddmmyyyyMatch;
      date = new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h4 className="ml-3">Conversation</h4>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'Conversation not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
              {conversation.participant.avatar ? (
                <img
                  src={conversation.participant.avatar}
                  alt={conversation.participant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-sm font-semibold">
                  {conversation.participant.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              {conversation.participant.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="line-clamp-1">{conversation.participant.name}</h4>
              <p className="text-xs text-[#757575] line-clamp-1">{conversation.participant.organization}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                <Phone className="w-5 h-5 text-[#757575]" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                <Video className="w-5 h-5 text-[#757575]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.isCurrentUser ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isCurrentUser
                    ? 'bg-[#2E7D32] text-white rounded-br-sm'
                    : 'bg-white text-[#212121] rounded-bl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <p className={`text-xs text-[#757575] mt-1 px-2 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 pb-safe">
        <div className="flex items-end gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0">
            <Paperclip className="w-5 h-5 text-[#757575]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-[#757575]" />
          </button>
          <div className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="w-full bg-transparent text-sm text-[#212121] placeholder:text-[#757575] resize-none outline-none max-h-24"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
              messageText.trim()
                ? 'bg-[#2E7D32] hover:bg-[#1B5E20]'
                : 'bg-gray-200'
            }`}
          >
            <Send className={`w-5 h-5 ${messageText.trim() ? 'text-white' : 'text-[#757575]'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
