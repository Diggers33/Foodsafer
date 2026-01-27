import { useState, useEffect } from 'react';
import { ArrowLeft, Star, MoreVertical, Smile, Paperclip, Send, Heart, ThumbsUp, Check, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { api } from '@/api';

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

interface Discussion {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  attachments: { name: string; size: string }[];
  tags: string[];
  reactions: { emoji: string; count: number }[];
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';
  let date: Date;
  const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (ddmmyyyyMatch) {
    const [, day, month, year, hour, min, sec] = ddmmyyyyMatch;
    date = new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
  } else {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) return dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function mapDiscussion(d: any): Discussion {
  const creator = d.creator || d.author || {};
  const authorName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || 'Unknown';
  const avatar = creator.avatar ? (creator.avatar.startsWith('http') ? creator.avatar : `${API_BASE}${creator.avatar}`) : '';

  return {
    id: d.id,
    title: d.title || d.name || 'Untitled',
    author: { name: authorName, avatar },
    timestamp: formatTimeAgo(d.createdAt || d.updatedAt),
    content: d.text || d.content || d.description || '',
    attachments: (d.attachments || []).map((a: any) => ({
      name: a.name || a.filename || 'Attachment',
      size: a.size ? `${(a.size / 1024 / 1024).toFixed(1)} MB` : '',
    })),
    tags: d.tags || [],
    reactions: d.reactions || [],
  };
}

function mapReply(c: any): Reply {
  const creator = c.creator || c.author || c.user || {};
  const authorName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || 'Unknown';
  const avatar = creator.avatar ? (creator.avatar.startsWith('http') ? creator.avatar : `${API_BASE}${creator.avatar}`) : '';

  return {
    id: c.id,
    author: { name: authorName, avatar },
    content: c.text || c.content || '',
    timestamp: formatTimeAgo(c.createdAt || c.updatedAt),
    reactions: c.reactions || [],
    replies: (c.replies || c.children || []).map(mapReply),
  };
}

export function DiscussionDetail({ discussionId, onBack }: DiscussionDetailProps) {
  const [isFollowing, setIsFollowing] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscussion();
  }, [discussionId]);

  const fetchDiscussion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/queries/discussions/${discussionId}`);
      setDiscussion(mapDiscussion(data));

      // Fetch comments/replies
      try {
        const commentsData = await api.get<any[]>(`/queries/discussions/${discussionId}/comments`);
        const commentsArray = Array.isArray(commentsData) ? commentsData : [];
        setReplies(commentsArray.map(mapReply));
      } catch {
        // Comments endpoint may not exist
        setReplies([]);
      }
    } catch (err) {
      console.error('Failed to load discussion:', err);
      setError(err instanceof Error ? err.message : 'Failed to load discussion');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#757575]" />
            </button>
            <h2 className="ml-3">Discussion</h2>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'Discussion not found'}</p>
        </div>
      </div>
    );
  }

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
            <img src={discussion.author.avatar} alt={discussion.author.name} className="w-full h-full object-cover" />
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4>{discussion.author.name}</h4>
            <p className="text-sm text-[#757575]">{discussion.timestamp}</p>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3">{discussion.title}</h2>

        {/* Content */}
        <div className="text-[#212121] leading-relaxed mb-4 whitespace-pre-line">
          {discussion.content}
        </div>

        {/* Attachments */}
        {discussion.attachments.length > 0 && (
          <div className="mb-4 space-y-2">
            {discussion.attachments.map((attachment, index) => (
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
          {discussion.tags.map((tag) => {
            const tagName = typeof tag === 'object' && tag !== null ? (tag as any).name : tag;
            const tagKey = typeof tag === 'object' && tag !== null ? (tag as any).id || tagName : tag;
            return (
              <Badge
                key={tagKey}
                variant="secondary"
                className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] text-xs"
              >
                #{tagName}
              </Badge>
            );
          })}
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {discussion.reactions.map((reaction, index) => (
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
        <h3 className="mb-4">Replies ({replies.length})</h3>
        <div className="space-y-4">
          {replies.map((reply) => (
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
