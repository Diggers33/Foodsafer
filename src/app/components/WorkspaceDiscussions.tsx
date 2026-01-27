import { useState } from 'react';
import { Search, Filter, Plus, MessageSquare, Star } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { DiscussionDetail } from './DiscussionDetail';

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

const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Updated HACCP Protocol for Allergen Management',
    author: {
      name: 'Dr. Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    preview: 'I\'ve drafted an updated protocol based on the new FDA guidelines...',
    tags: ['HACCP', 'Allergens', 'Protocol'],
    replyCount: 15,
    lastActivity: '2h ago',
    isFollowing: true,
    hasUnread: true,
  },
  {
    id: '2',
    title: 'Q3 Audit Preparation Checklist',
    author: {
      name: 'James Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    preview: 'Here\'s a comprehensive checklist for our upcoming Q3 audit...',
    tags: ['Audit', 'Compliance'],
    replyCount: 8,
    lastActivity: '5h ago',
    isFollowing: false,
    hasUnread: true,
  },
  {
    id: '3',
    title: 'Best Practices for Temperature Monitoring',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    preview: 'Let\'s compile our best practices for temperature monitoring across facilities...',
    tags: ['Monitoring', 'Best Practices'],
    replyCount: 23,
    lastActivity: '1d ago',
    isFollowing: true,
    hasUnread: false,
  },
  {
    id: '4',
    title: 'Training Materials for New Team Members',
    author: {
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    },
    preview: 'I\'ve created some training materials for new hires. Looking for feedback...',
    tags: ['Training', 'Onboarding'],
    replyCount: 12,
    lastActivity: '2d ago',
    isFollowing: false,
    hasUnread: false,
  },
];

export function WorkspaceDiscussions({ workspaceId }: WorkspaceDiscussionsProps) {
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);

  if (selectedDiscussion) {
    return (
      <DiscussionDetail 
        discussionId={selectedDiscussion} 
        onBack={() => setSelectedDiscussion(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
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
        <span className="text-sm text-[#757575]">{mockDiscussions.length} discussions</span>
      </div>

      {/* Discussions List */}
      <div className="px-4 py-4 space-y-3">
        {mockDiscussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            discussion={discussion}
            onClick={() => setSelectedDiscussion(discussion.id)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full shadow-lg flex items-center justify-center z-40">
        <Plus className="w-6 h-6 text-white" />
      </button>
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
          <img src={discussion.author.avatar} alt={discussion.author.name} className="w-full h-full object-cover" />
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
        {discussion.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] text-xs"
          >
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 pl-4">
        <MessageSquare className="w-4 h-4 text-[#757575]" />
        <span className="text-sm text-[#757575]">{discussion.replyCount} replies</span>
      </div>
    </article>
  );
}
