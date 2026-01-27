import { useState } from 'react';
import { Plus, Heart, MessageCircle, Share2, Bookmark, X, Send, ArrowLeft, Image as ImageIcon, FileText, BarChart3, Smile, AtSign, Hash, Globe, Users, Lock, ChevronDown, MoreHorizontal, Edit2, Trash2, Flag, Copy, BellOff, UserX, ExternalLink, ThumbsUp, ThumbsDown, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { LinkedInStylePost } from './LinkedInStylePost';
import { PostDetailView } from './PostDetailView';
import { AppHeader } from './AppHeader';

interface Post {
  id: string;
  author: {
    name: string;
    organization: string;
    avatar: string;
  };
  timestamp: string;
  title: string;
  content: string;
  image?: string;
  images?: string[];
  documents?: string[];
  tags: string[];
  reactions: number;
  comments: number;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Dr. Maria Rodriguez',
      organization: 'Global Food Standards',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    timestamp: '2h ago',
    title: 'New HACCP Guidelines Released for 2026',
    content: 'The international food safety committee has just released updated HACCP guidelines. Key changes include enhanced monitoring protocols for allergen management and new digital traceability requirements...',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop',
    tags: ['HACCP', 'Guidelines', 'Food Safety'],
    reactions: 47,
    comments: 12,
  },
  {
    id: '2',
    author: {
      name: 'James Chen',
      organization: 'SafeFood Consulting',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    timestamp: '5h ago',
    title: 'Successful Food Safety Audit at Three Facilities',
    content: 'Proud to share that our team completed comprehensive audits across three production facilities this week. All sites achieved excellent scores and implemented our new digital checklist system. Swipe through to see our team in action! 📋✅',
    images: [
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581093458791-9d42e55b2b7d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop',
    ],
    tags: ['Audit', 'Team', 'Success'],
    reactions: 156,
    comments: 34,
  },
  {
    id: '3',
    author: {
      name: 'Sarah Williams',
      organization: 'FoodTech Innovations',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    },
    timestamp: '1d ago',
    title: 'AI in Food Safety: Game Changer or Hype?',
    content: 'We\'ve been testing AI-powered inspection systems for the past 6 months. The results are fascinating, but there are important considerations before implementation...',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    tags: ['Technology', 'AI', 'Innovation'],
    reactions: 134,
    comments: 56,
  },
];

const reactionTypes = [
  { id: 'like', label: 'Like', icon: ThumbsUp, color: '#36B9D0' },
  { id: 'not-relevant', label: 'Not relevant', icon: ThumbsDown, color: '#9E9E9E' },
  { id: 'recommend', label: 'Recommend', icon: CheckCircle, color: '#4CAF50' },
  { id: 'insightful', label: 'Insightful', icon: Lightbulb, color: '#F68714' },
  { id: 'inappropriate', label: 'Inappropriate', icon: AlertTriangle, color: '#D32F2F' },
];

export function HomeFeed({ onProfileClick }: { onProfileClick: () => void }) {
  const [notificationCount] = useState(3);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [viewingPost, setViewingPost] = useState<string | null>(null);

  const handleCreatePost = (postData: any) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        organization: 'Your Organization',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      },
      timestamp: 'Just now',
      title: postData.content.split('\n')[0].slice(0, 100) || 'Untitled Post',
      content: postData.content,
      image: postData.images[0],
      images: postData.images,
      documents: postData.documents,
      tags: postData.tags,
      reactions: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    
    // Clear draft after successful post
    localStorage.removeItem('foodsafer_post_draft');
    
    setShowCreatePost(false);
  };

  const toggleReaction = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, reactions: p.reactions + 1 };
      }
      return p;
    }));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  // Post Detail View with Comments
  if (viewingPost) {
    return <PostDetailView postId={viewingPost} onBack={() => setViewingPost(null)} posts={posts} setPosts={setPosts} />;
  }

  // Create Post Modal
  if (showCreatePost) {
    return <LinkedInStylePost onClose={() => setShowCreatePost(false)} onPost={handleCreatePost} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <AppHeader onProfileClick={onProfileClick} notificationCount={notificationCount} />

      {/* Feed */}
      <div className="px-4 py-4 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} toggleReaction={toggleReaction} setViewingPost={setViewingPost} handleDeletePost={handleDeletePost} />
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

function PostCard({ post, toggleReaction, setViewingPost, handleDeletePost }: { post: Post, toggleReaction: (postId: string) => void, setViewingPost: (postId: string | null) => void, handleDeletePost: (postId: string) => void }) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleReaction = (reactionType: string) => {
    setSelectedReaction(reactionType);
    setShowReactionPicker(false);
    toggleReaction(post.id);
  };

  const ReactionIcon = selectedReaction 
    ? reactionTypes.find(r => r.id === selectedReaction)?.icon || ThumbsUp
    : ThumbsUp;
  const reactionColor = selectedReaction
    ? reactionTypes.find(r => r.id === selectedReaction)?.color || '#757575'
    : '#757575';

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Author Info */}
      <div className="flex items-start gap-3 p-4">
        <Avatar className="w-10 h-10">
          <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="truncate">{post.author.name}</h4>
          <p className="text-sm text-[#757575] truncate">{post.author.organization}</p>
          <p className="text-xs text-[#757575]">{post.timestamp}</p>
        </div>
        {/* Three-dot menu */}
        {post.author.name === 'You' && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MoreHorizontal className="w-5 h-5 text-[#757575]" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      setViewingPost(post.id);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                  >
                    <Edit2 className="w-4 h-4 text-[#757575]" />
                    <span className="text-sm">Edit post</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      handleDeletePost(post.id);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                  >
                    <Trash2 className="w-4 h-4 text-[#D32F2F]" />
                    <span className="text-sm text-[#D32F2F]">Delete post</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content - Clickable to open post */}
      <div 
        className="px-4 pb-3 cursor-pointer"
        onClick={() => setViewingPost(post.id)}
      >
        <h3 className="mb-1.5">{post.title}</h3>
        <p className="text-[#212121] leading-snug line-clamp-3">
          {post.content}
        </p>
        <button className="text-[#36B9D0] text-sm mt-1">Read more</button>
      </div>

      {/* Single Image - Clickable to open post */}
      {post.image && !post.images && (
        <div 
          className="w-full cursor-pointer"
          onClick={() => setViewingPost(post.id)}
        >
          <img src={post.image} alt="" className="w-full h-48 object-cover" />
        </div>
      )}

      {/* Multiple Images Grid - Clickable to open post */}
      {post.images && post.images.length > 0 && (
        <div 
          className="w-full cursor-pointer px-4"
          onClick={() => setViewingPost(post.id)}
        >
          {post.images.length === 1 && (
            <img src={post.images[0]} alt="" className="w-full h-64 object-cover rounded-lg" />
          )}
          {post.images.length === 2 && (
            <div className="grid grid-cols-2 gap-1">
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt="" className="w-full h-48 object-cover rounded-lg" />
              ))}
            </div>
          )}
          {post.images.length === 3 && (
            <div className="grid grid-cols-2 gap-1">
              <img src={post.images[0]} alt="" className="w-full h-64 object-cover rounded-lg col-span-2" />
              <img src={post.images[1]} alt="" className="w-full h-32 object-cover rounded-lg" />
              <img src={post.images[2]} alt="" className="w-full h-32 object-cover rounded-lg" />
            </div>
          )}
          {post.images.length >= 4 && (
            <div className="grid grid-cols-2 gap-1">
              {post.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt="" className="w-full h-40 object-cover rounded-lg" />
                  {idx === 3 && post.images && post.images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-semibold">+{post.images.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] text-xs"
          >
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Interaction Bar */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReactionPicker(!showReactionPicker);
              }}
              className="flex items-center gap-1 text-sm"
              style={{ color: selectedReaction ? reactionColor : '#757575' }}
            >
              <ReactionIcon
                className={`w-5 h-5 ${selectedReaction ? 'fill-current' : ''}`}
              />
              <span>{post.reactions}</span>
            </button>

            {/* Reaction Picker */}
            {showReactionPicker && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowReactionPicker(false)}
                />
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-20">
                  {reactionTypes.map(reaction => (
                    <button
                      key={reaction.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(reaction.id);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                    >
                      <reaction.icon className="w-4 h-4" style={{ color: reaction.color }} />
                      <span className="text-sm text-[#212121]">{reaction.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => setViewingPost(post.id)}
            className="flex items-center gap-1 text-sm"
          >
            <MessageCircle className="w-5 h-5 text-[#757575]" />
            <span className="text-[#757575]">{post.comments}</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={(e) => e.stopPropagation()}>
            <Share2 className="w-5 h-5 text-[#757575]" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
          >
            <Bookmark
              className={`w-5 h-5 ${isSaved ? 'fill-[#2E7D32] text-[#2E7D32]' : 'text-[#757575]'}`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}