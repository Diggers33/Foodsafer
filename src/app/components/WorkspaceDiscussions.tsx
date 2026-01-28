import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MessageSquare, Star, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { DiscussionDetail } from './DiscussionDetail';
import { api } from '@/api';

interface WorkspaceDiscussionsProps {
  workspaceId: string;
}

interface Discussion {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  preview: string;
  tags: string[];
  replyCount: number;
  lastActivity: string;
  isFollowing: boolean;
  hasUnread: boolean;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

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
  const avatar = creator.avatar ?
    (creator.avatar.startsWith('http') ? creator.avatar : `${API_BASE}${creator.avatar}`) : '';

  return {
    id: d.id,
    title: d.title || d.name || 'Untitled',
    author: { name: authorName, avatar },
    preview: stripHtml(d.text || d.content || d.description || ''),
    tags: d.tags || [],
    replyCount: d.commentsCount || d.replyCount || d.numComments || 0,
    lastActivity: formatTimeAgo(d.updatedAt || d.createdAt),
    isFollowing: d.isFollowing || false,
    hasUnread: d.hasUnread || false,
  };
}

export function WorkspaceDiscussions({ workspaceId }: WorkspaceDiscussionsProps) {
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscussions();
  }, [workspaceId]);

  const fetchDiscussions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>(`/queries/workspaces/${workspaceId}/discussions?sort=1`);
      const discussionsArray = Array.isArray(data) ? data : [];
      setDiscussions(discussionsArray.map(mapDiscussion));
    } catch (err) {
      console.error('Failed to load discussions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load discussions');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedDiscussion) {
    return (
      <DiscussionDetail
        discussionId={selectedDiscussion}
        onBack={() => setSelectedDiscussion(null)}
      />
    );
  }

  return (
    <div className="bg-[#F5F5F5]">
      {/* Filter Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button>
            <Search className="w-5 h-5 text-[#757575]" />
          </button>
          <button>
            <Filter className="w-5 h-5 text-[#757575]" />
          </button>
        </div>
        <span className="text-sm text-[#757575]">{discussions.length} discussions</span>
      </div>

      {/* Discussions List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#757575]">No discussions yet</p>
          </div>
        ) : (
          discussions.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              onClick={() => setSelectedDiscussion(discussion.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DiscussionCard({ 
  discussion, 
  onClick 
}: { 
  discussion: Discussion; 
  onClick: () => void;
}) {
  const [isFollowing, setIsFollowing] = useState(discussion.isFollowing);

  return (
    <article 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 relative cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Unread Indicator */}
      {discussion.hasUnread && (
        <span className="absolute top-4 left-4 w-2 h-2 bg-[#2E7D32] rounded-full"></span>
      )}
      
      {/* Author Info */}
      <div className="flex items-start gap-3 mb-3 pl-4">
        <Avatar className="w-8 h-8">
          {discussion.author.avatar ? (
            <img src={discussion.author.avatar} alt={discussion.author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-semibold">
              {discussion.author.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="line-clamp-1">{discussion.author.name}</h4>
          <p className="text-xs text-[#757575]">{discussion.lastActivity}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFollowing(!isFollowing);
          }}
          className="flex-shrink-0"
        >
          <Star
            className={`w-5 h-5 ${
              isFollowing ? 'fill-[#FFC107] text-[#FFC107]' : 'text-[#757575]'
            }`}
          />
        </button>
      </div>

      {/* Discussion Title */}
      <h3 className="mb-2 pl-4">{discussion.title}</h3>

      {/* Preview */}
      <p className="text-sm text-[#757575] mb-3 pl-4 line-clamp-2">
        {discussion.preview}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3 pl-4">
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

      {/* Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 pl-4">
        <MessageSquare className="w-4 h-4 text-[#757575]" />
        <span className="text-sm text-[#757575]">{discussion.replyCount} replies</span>
      </div>
    </article>
  );
}
