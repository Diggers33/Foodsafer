import { useState, useEffect } from 'react';
import { Plus, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit2, Trash2, ThumbsUp, ThumbsDown, CheckCircle, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { LinkedInStylePost } from './LinkedInStylePost';
import { PostDetailView } from './PostDetailView';
import { AppHeader } from './AppHeader';
import { postsService, Post as ApiPost } from '@/api';
import { useApp } from '../App';

// Local Post type for display (adapts API type)
interface DisplayPost {
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
  isOwner: boolean;
}

const reactionTypes = [
  { id: 'like', label: 'Like', icon: ThumbsUp, color: '#36B9D0' },
  { id: 'not-relevant', label: 'Not relevant', icon: ThumbsDown, color: '#9E9E9E' },
  { id: 'recommend', label: 'Recommend', icon: CheckCircle, color: '#4CAF50' },
  { id: 'insightful', label: 'Insightful', icon: Lightbulb, color: '#F68714' },
  { id: 'inappropriate', label: 'Inappropriate', icon: AlertTriangle, color: '#D32F2F' },
];

// Helper to convert API post to display post
function toDisplayPost(post: ApiPost, currentUserId?: string): DisplayPost {
  const author = post.author || {};
  const authorName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Unknown';
  return {
    id: post.id,
    author: {
      name: authorName,
      organization: author.organization || '',
      avatar: author.avatar || '',
    },
    timestamp: formatTimestamp(post.createdAt),
    title: post.title || '',
    content: post.content || '',
    image: post.images?.[0],
    images: post.images || [],
    documents: post.documents || [],
    tags: post.tags || [],
    reactions: post.reactionCount || 0,
    comments: post.commentCount || 0,
    isOwner: author.id === currentUserId,
  };
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
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

export function HomeFeed({ onProfileClick }: { onProfileClick: () => void }) {
  const { currentUser } = useApp();
  const [notificationCount] = useState(3);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [viewingPost, setViewingPost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postsService.getAll();
      // API returns array directly, not { data: [...] }
      const postsArray = Array.isArray(response) ? response : response.data || [];
      const displayPosts = postsArray.map((post) => toDisplayPost(post, currentUser?.id));
      setPosts(displayPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData: { content: string; images: string[]; documents: string[]; tags: string[]; visibility: string }) => {
    try {
      const newPost = await postsService.create({
        title: postData.content.split('\n')[0].slice(0, 100) || 'Untitled Post',
        content: postData.content,
        images: postData.images,
        documents: postData.documents,
        tags: postData.tags,
        visibility: postData.visibility as 'public' | 'private' | 'workspace',
      });

      const displayPost = toDisplayPost(newPost, currentUser?.id);
      setPosts([displayPost, ...posts]);

      // Clear draft after successful post
      localStorage.removeItem('foodsafer_post_draft');
      setShowCreatePost(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const toggleReaction = async (postId: string, reactionType: string) => {
    try {
      await postsService.react(postId, reactionType as 'like' | 'not-relevant' | 'recommend' | 'insightful' | 'inappropriate');
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, reactions: p.reactions + 1 };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to react to post:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postsService.delete(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    }
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPosts} variant="outline">
              Try Again
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#757575] mb-4">No posts yet. Be the first to share!</p>
            <Button onClick={() => setShowCreatePost(true)} className="bg-[#2E7D32]">
              Create Post
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              toggleReaction={toggleReaction}
              setViewingPost={setViewingPost}
              handleDeletePost={handleDeletePost}
            />
          ))
        )}
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

function PostCard({
  post,
  toggleReaction,
  setViewingPost,
  handleDeletePost,
}: {
  post: DisplayPost;
  toggleReaction: (postId: string, reactionType: string) => void;
  setViewingPost: (postId: string | null) => void;
  handleDeletePost: (postId: string) => void;
}) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleReaction = (reactionType: string) => {
    setSelectedReaction(reactionType);
    setShowReactionPicker(false);
    toggleReaction(post.id, reactionType);
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await postsService.unsave(post.id);
      } else {
        await postsService.save(post.id);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Failed to save/unsave post:', err);
    }
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
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-sm font-semibold">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="truncate">{post.author.name}</h4>
          <p className="text-sm text-[#757575] truncate">{post.author.organization}</p>
          <p className="text-xs text-[#757575]">{post.timestamp}</p>
        </div>
        {/* Three-dot menu */}
        {post.isOwner && (
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
              handleSave();
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
