import { ArrowLeft, Send, Paperclip, Image as ImageIcon, Phone, Video } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

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

const mockConversation: Conversation = {
  id: '1',
  participant: {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    organization: 'FreshPro Organic Foods',
    online: true,
  },
  messages: [
    {
      id: '1',
      senderId: 'other',
      text: 'Hi! Thanks for connecting. I saw your profile and would love to discuss some collaboration opportunities.',
      timestamp: '2026-01-13T10:30:00',
      isCurrentUser: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Hello Sarah! Nice to connect with you. I\'d be happy to discuss collaboration. What areas are you thinking about?',
      timestamp: '2026-01-13T10:32:00',
      isCurrentUser: true,
    },
    {
      id: '3',
      senderId: 'other',
      text: 'We\'re looking to improve our HACCP implementation and I noticed you have extensive experience in that area. Would you be available for a consultation?',
      timestamp: '2026-01-13T10:35:00',
      isCurrentUser: false,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Absolutely! I\'d be glad to help. We can schedule a call to discuss your specific needs and challenges.',
      timestamp: '2026-01-13T10:37:00',
      isCurrentUser: true,
    },
  ],
};

export function MessageThread({ conversationId, onBack }: { conversationId: string; onBack: () => void }) {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(mockConversation.messages);
  const conversation = mockConversation;

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
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

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
              <img
                src={conversation.participant.avatar}
                alt={conversation.participant.name}
                className="w-full h-full object-cover"
              />
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
