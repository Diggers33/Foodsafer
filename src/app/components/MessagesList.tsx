import { ArrowLeft, Search, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { MessageThread } from './MessageThread';

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

const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      organization: 'FreshPro Organic Foods',
      online: true,
    },
    lastMessage: {
      text: 'We\'re looking to improve our HACCP implementation...',
      timestamp: '2026-01-13T10:35:00',
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participant: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      organization: 'SafetyFirst Lab Services',
      online: false,
    },
    lastMessage: {
      text: 'Thanks for the consultation yesterday!',
      timestamp: '2026-01-12T16:20:00',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participant: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      organization: 'NutriGreen Solutions',
      online: true,
    },
    lastMessage: {
      text: 'Can you share that allergen control template?',
      timestamp: '2026-01-12T14:15:00',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '4',
    participant: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      organization: 'Pacific Food Safety Institute',
      online: false,
    },
    lastMessage: {
      text: 'Looking forward to the training session next week',
      timestamp: '2026-01-11T09:30:00',
      isRead: true,
    },
    unreadCount: 0,
  },
];

export function MessagesList({ onBack }: { onBack: () => void }) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  if (selectedConversation) {
    return (
      <MessageThread
        conversationId={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
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
        {mockConversations.map((conversation) => (
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
      {mockConversations.length === 0 && (
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
