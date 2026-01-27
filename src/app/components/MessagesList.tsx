import { ArrowLeft, Search, MessageSquare, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MessageThread } from './MessageThread';
import { api } from '@/api';

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    organization: string;
    online: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}

const API_BASE = 'https://test.foodsafer.com/api';

function mapConversation(c: any): Conversation {
  const participant = c.participant || c.otherUser || c.user || {};
  const avatar = participant.avatar ? (participant.avatar.startsWith('http') ? participant.avatar : `${API_BASE}${participant.avatar}`) : '';
  const participantName = `${participant.firstName || ''} ${participant.lastName || ''}`.trim() || participant.name || 'Unknown';

  const lastMsg = c.lastMessage || c.latestMessage || {};

  return {
    id: c.id,
    participant: {
      name: participantName,
      avatar,
      organization: participant.organization || participant.company || '',
      online: participant.online ?? participant.isOnline ?? false,
    },
    lastMessage: {
      text: lastMsg.text || lastMsg.content || lastMsg.message || '',
      timestamp: lastMsg.createdAt || lastMsg.timestamp || c.updatedAt || '',
      isRead: lastMsg.isRead ?? lastMsg.read ?? true,
    },
    unreadCount: c.unreadCount || c.unreadMessages || 0,
  };
}

export function MessagesList({ onBack }: { onBack: () => void }) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>('/queries/conversations');
      const dataArray = Array.isArray(data) ? data : [];
      setConversations(dataArray.map(mapConversation));
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedConversation) {
    return (
      <MessageThread
        conversationId={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    let date: Date;
    const ddmmyyyyMatch = timestamp.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (ddmmyyyyMatch) {
      const [, day, month, year, hour, min, sec] = ddmmyyyyMatch;
      date = new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) return timestamp;
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h1 className="ml-3">Messages</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-[#212121]" />
              </button>
              <h1>Messages</h1>
            </div>
            <button>
              <Search className="w-6 h-6 text-[#757575]" />
            </button>
          </div>
        </div>
      </header>

      {/* Conversations List */}
      <div className="px-4 py-4 space-y-2">
        {conversations.map((conversation) => (
          <article
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation.id)}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {conversation.participant.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#4CAF50] border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <h4 className="line-clamp-1 mb-0.5">{conversation.participant.name}</h4>
                    <p className="text-xs text-[#757575] line-clamp-1">{conversation.participant.organization}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-[#757575]">
                      {formatTimestamp(conversation.lastMessage.timestamp)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>

                <p className={`text-sm line-clamp-2 ${
                  conversation.lastMessage.isRead ? 'text-[#757575]' : 'text-[#212121]'
                }`}>
                  {conversation.lastMessage.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State (if no conversations) */}
      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <MessageSquare className="w-16 h-16 text-[#757575] mb-4" />
          <h3 className="text-center mb-2">No Messages Yet</h3>
          <p className="text-center text-sm text-[#757575] max-w-xs">
            Start connecting with food safety professionals to begin conversations
          </p>
        </div>
      )}
    </div>
  );
}
