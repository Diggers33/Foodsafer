import { useState } from 'react';
import { ArrowLeft, Star, MoreVertical, Smile, Paperclip, Send, Heart, ThumbsUp, Check } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface DiscussionDetailProps {
  discussionId: string;
  onBack: () => void;
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  reactions: { emoji: string; count: number }[];
  replies?: Reply[];
}

const mockDiscussion = {
  id: '1',
  title: 'Updated HACCP Protocol for Allergen Management',
  author: {
    name: 'Dr. Maria Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
  },
  timestamp: '2 hours ago',
  content: `I've drafted an updated HACCP protocol specifically focused on allergen management based on the new FDA guidelines released this month. 

Key updates include:
- Enhanced cleaning and sanitation procedures between allergen runs
- Updated allergen declaration requirements
- New documentation standards for allergen control
- Modified training requirements for staff

Please review the attached document and provide your feedback. We need to finalize this by end of week for implementation across all facilities.

Looking forward to your thoughts!`,
  attachments: [
    { name: 'HACCP_Allergen_Protocol_v3.pdf', size: '2.4 MB' },
  ],
  tags: ['HACCP', 'Allergens', 'Protocol'],
  reactions: [
    { emoji: '👍', count: 8 },
    { emoji: '❤️', count: 3 },
    { emoji: '✓', count: 5 },
  ],
};

const mockReplies: Reply[] = [
  {
    id: '1',
    author: {
      name: 'James Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    content: 'Great work Maria! I\'ve reviewed the protocol and it looks comprehensive. One suggestion: should we add specific guidance for dedicated allergen-free production lines?',
    timestamp: '1 hour ago',
    reactions: [{ emoji: '👍', count: 4 }],
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Dr. Maria Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        },
        content: 'Excellent point James! I\'ll add a section on dedicated line management. Can you share any specific requirements from your facility?',
        timestamp: '45 minutes ago',
        reactions: [],
      },
    ],
  },
  {
    id: '2',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    content: 'This is very thorough. I especially like the updated training requirements section. We\'ve been implementing something similar at our West Coast facilities and it\'s been effective.',
    timestamp: '30 minutes ago',
    reactions: [{ emoji: '❤️', count: 2 }],
  },
  {
    id: '3',
    author: {
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    },
    content: 'Quick question - will this replace the existing protocol entirely or supplement it? Want to make sure our documentation is updated correctly.',
    timestamp: '15 minutes ago',
    reactions: [],
  },
];

export function DiscussionDetail({ discussionId, onBack }: DiscussionDetailProps) {
  const [isFollowing, setIsFollowing] = useState(true);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#757575]" />
            </button>
            <h2>Discussion</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsFollowing(!isFollowing)}>
              <Star
                className={`w-6 h-6 ${
                  isFollowing ? 'fill-[#FFC107] text-[#FFC107]' : 'text-[#757575]'
                }`}
              />
            </button>
            <button>
              <MoreVertical className="w-6 h-6 text-[#757575]" />
            </button>
          </div>
        </div>
      </header>

      {/* Original Post */}
      <div className="bg-white px-4 py-4 mb-2">
        {/* Author Info */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-10 h-10">
            <img src={mockDiscussion.author.avatar} alt={mockDiscussion.author.name} className="w-full h-full object-cover" />
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4>{mockDiscussion.author.name}</h4>
            <p className="text-sm text-[#757575]">{mockDiscussion.timestamp}</p>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3">{mockDiscussion.title}</h2>

        {/* Content */}
        <div className="text-[#212121] leading-relaxed mb-4 whitespace-pre-line">
          {mockDiscussion.content}
        </div>

        {/* Attachments */}
        {mockDiscussion.attachments.length > 0 && (
          <div className="mb-4 space-y-2">
            {mockDiscussion.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg"
              >
                <Paperclip className="w-5 h-5 text-[#757575]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{attachment.name}</p>
                  <p className="text-xs text-[#757575]">{attachment.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mockDiscussion.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {mockDiscussion.reactions.map((reaction, index) => (
            <button
              key={index}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F5F5] hover:bg-gray-200 rounded-full"
            >
              <span>{reaction.emoji}</span>
              <span className="text-sm text-[#757575]">{reaction.count}</span>
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-full">
            <Smile className="w-4 h-4 text-[#757575]" />
            <span className="text-sm text-[#757575]">Add</span>
          </button>
        </div>
      </div>

      {/* Replies Section */}
      <div className="bg-white px-4 py-4 mb-20">
        <h3 className="mb-4">Replies ({mockReplies.length})</h3>
        <div className="space-y-4">
          {mockReplies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </div>
      </div>

      {/* Fixed Reply Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <div className="flex items-center gap-2 max-w-screen-xl mx-auto">
          <button className="flex-shrink-0">
            <Paperclip className="w-6 h-6 text-[#757575]" />
          </button>
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 bg-[#F5F5F5] border-none rounded-full"
          />
          <button className="flex-shrink-0 w-10 h-10 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReplyItem({ reply, isNested = false }: { reply: Reply; isNested?: boolean }) {
  return (
    <div className={isNested ? 'ml-8 mt-3' : ''}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <img src={reply.author.avatar} alt={reply.author.name} className="w-full h-full object-cover" />
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm">{reply.author.name}</h4>
            <span className="text-xs text-[#757575]">{reply.timestamp}</span>
          </div>
          <p className="text-sm text-[#212121] leading-relaxed mb-2">
            {reply.content}
          </p>
          
          {/* Reactions */}
          {reply.reactions.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              {reply.reactions.map((reaction, index) => (
                <button
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-[#F5F5F5] hover:bg-gray-200 rounded-full"
                >
                  <span className="text-xs">{reaction.emoji}</span>
                  <span className="text-xs text-[#757575]">{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
          
          <button className="text-sm text-[#2E7D32]">Reply</button>
        </div>
      </div>

      {/* Nested Replies */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-3">
          {reply.replies.map((nestedReply) => (
            <ReplyItem key={nestedReply.id} reply={nestedReply} isNested />
          ))}
        </div>
      )}
    </div>
  );
}
