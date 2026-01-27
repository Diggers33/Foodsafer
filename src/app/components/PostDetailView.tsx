import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit2, Trash2, Flag, Copy, BellOff, UserX, X, Send, ThumbsUp, Lightbulb, PartyPopper, ThumbsDown, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { LinkedInStylePost } from './LinkedInStylePost';
import { api } from '@/api';

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

interface Comment {
  id: string;
  author: {
    name: string;
    organization: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  isOwn: boolean;
}

interface Reactor {
  name: string;
  avatar: string;
  type: string;
  organization?: string;
}

interface PostDetailViewProps {
  postId: string;
  onBack: () => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

const API_BASE = 'https://test.foodsafer.com/api';

const reactionTypes = [
  { id: 'like', label: 'Like', icon: ThumbsUp, color: '#36B9D0' },
  { id: 'not-relevant', label: 'Not relevant', icon: ThumbsDown, color: '#9E9E9E' },
  { id: 'recommend', label: 'Recommend', icon: CheckCircle, color: '#4CAF50' },
  { id: 'insightful', label: 'Insightful', icon: Lightbulb, color: '#F68714' },
  { id: 'inappropriate', label: 'Inappropriate', icon: AlertTriangle, color: '#D32F2F' },
];

function mapReactor(r: any): Reactor {
  const user = r.user || r;
  const avatar = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`) : '';
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Unknown';
  return {
    name,
    avatar,
    type: r.type || r.reactionType || 'like',
    organization: user.organization || user.company || 'Food Safety Professional',
  };
}

export function PostDetailView({ postId, onBack, posts, setPosts }: PostDetailViewProps) {
  const post = posts.find(p => p.id === postId);
  const isOwnPost = post?.author.name === 'You';

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showEditPost, setShowEditPost] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reactors, setReactors] = useState<Reactor[]>([]);
  const [isLoadingReactors, setIsLoadingReactors] = useState(false);

  useEffect(() => {
    if (showReactions && reactors.length === 0) {
      fetchReactors();
    }
  }, [showReactions]);

  const fetchReactors = async () => {
    setIsLoadingReactors(true);
    try {
      const data = await api.get<any[]>(`/queries/posts/${postId}/reactions`);
      const dataArray = Array.isArray(data) ? data : [];
      setReactors(dataArray.map(mapReactor));
    } catch (err) {
      console.error('Failed to load reactions:', err);
      // Keep empty array if fetch fails
    } finally {
      setIsLoadingReactors(false);
    }
  };

  if (!post) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          name: 'You',
          organization: 'Your Organization',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        },
        timestamp: 'Just now',
        content: newComment,
        isOwn: true,
      };
      setComments([...comments, comment]);
      setNewComment('');
      
      // Update comment count
      setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    }
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditCommentText(comment.content);
    }
  };

  const handleSaveComment = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, content: editCommentText } : c
    ));
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p));
  };

  const handleDeletePost = () => {
    setPosts(posts.filter(p => p.id !== postId));
    onBack();
  };

  const handleReaction = (reactionType: string) => {
    setSelectedReaction(reactionType);
    setShowReactionPicker(false);
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, reactions: p.reactions + 1 } : p
    ));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://foodsafer.app/post/${postId}`);
    setShowPostMenu(false);
    // In a real app, show a toast notification
  };

  const handleUpdatePost = (postData: any) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          title: postData.content.split('\n')[0].slice(0, 100) || p.title,
          content: postData.content,
          image: postData.images[0] || p.image,
          images: postData.images,
          documents: postData.documents,
          tags: postData.tags,
        };
      }
      return p;
    }));
    setShowEditPost(false);
  };

  // Edit Post Modal
  if (showEditPost) {
    return (
      <LinkedInStylePost
        onClose={() => setShowEditPost(false)}
        onPost={handleUpdatePost}
        initialData={{
          content: post.content,
          images: post.images || (post.image ? [post.image] : []),
          tags: post.tags,
        }}
        isEditing={true}
      />
    );
  }

  const ReactionIcon = selectedReaction 
    ? reactionTypes.find(r => r.id === selectedReaction)?.icon || Heart
    : Heart;
  const reactionColor = selectedReaction
    ? reactionTypes.find(r => r.id === selectedReaction)?.color || '#757575'
    : '#757575';

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </button>
          <h1>Post</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Post Content */}
      <div className="px-4 py-4 space-y-4">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Author Info & Menu */}
          <div className="flex items-start gap-3 p-4">
            <Avatar className="w-12 h-12">
              <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4>{post.author.name}</h4>
              <p className="text-sm text-[#757575]">{post.author.organization}</p>
              <p className="text-xs text-[#757575]">{post.timestamp}</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowPostMenu(!showPostMenu)} className="p-1">
                <MoreHorizontal className="w-5 h-5 text-[#757575]" />
              </button>
              
              {/* Post Menu */}
              {showPostMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-56 z-50">
                  {isOwnPost && (
                    <>
                      <button
                        onClick={() => {
                          setShowEditPost(true);
                          setShowPostMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] text-left"
                      >
                        <Edit2 className="w-4 h-4 text-[#757575]" />
                        <span className="text-sm">Edit post</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowPostMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] text-left"
                      >
                        <Trash2 className="w-4 h-4 text-[#D32F2F]" />
                        <span className="text-sm text-[#D32F2F]">Delete post</span>
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                    </>
                  )}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] text-left"
                  >
                    <Copy className="w-4 h-4 text-[#757575]" />
                    <span className="text-sm">Copy link to post</span>
                  </button>
                  <button
                    onClick={() => setShowPostMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] text-left"
                  >
                    <Bookmark className="w-4 h-4 text-[#757575]" />
                    <span className="text-sm">Save post</span>
                  </button>
                  {!isOwnPost && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => setShowPostMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] text-left"
                      >
                        <BellOff className="w-4 h-4 text-[#757575]" />
                        <span className="text-sm">Turn off notifications</span>
                      </button>
                      <button
                        onClick={() => setShowPostMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] text-left"
                      >
                        <UserX className="w-4 h-4 text-[#757575]" />
                        <span className="text-sm">Unfollow {post.author.name}</span>
                      </button>
                      <button
                        onClick={() => setShowPostMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] text-left"
                      >
                        <Flag className="w-4 h-4 text-[#D32F2F]" />
                        <span className="text-sm text-[#D32F2F]">Report post</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <h3 className="mb-2">{post.title}</h3>
            <p className="text-[#212121] leading-snug whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Single Image */}
          {post.image && !post.images && (
            <div className="w-full">
              <img src={post.image} alt="" className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Multiple Images Grid */}
          {post.images && post.images.length > 0 && (
            <div className="w-full px-4">
              {post.images.length === 1 && (
                <img src={post.images[0]} alt="" className="w-full h-64 object-cover rounded-lg" />
              )}
              {post.images.length === 2 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-48 object-cover rounded-lg" />
                  ))}
                </div>
              )}
              {post.images.length === 3 && (
                <div className="grid grid-cols-2 gap-2">
                  <img src={post.images[0]} alt="" className="w-full h-64 object-cover rounded-lg col-span-2" />
                  <img src={post.images[1]} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <img src={post.images[2]} alt="" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
              {post.images.length >= 4 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-48 object-cover rounded-lg" />
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

          {/* Reaction Summary */}
          <div className="px-4 py-2 flex items-center justify-between text-sm text-[#757575]">
            <button 
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center gap-1 hover:underline"
            >
              <div className="flex -space-x-1">
                {reactionTypes.slice(0, 3).map((reaction) => {
                  const Icon = reaction.icon;
                  return (
                    <div key={reaction.id} className="w-5 h-5 rounded-full border border-white flex items-center justify-center" style={{ backgroundColor: reaction.color }}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                  );
                })}
              </div>
              <span>{post.reactions} reactions</span>
            </button>
            <span>{comments.length} comments</span>
          </div>

          {/* Interaction Bar */}
          <div className="px-4 py-2 border-t border-gray-100 grid grid-cols-4 gap-2">
            <div className="relative">
              <button
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                onMouseEnter={() => setShowReactionPicker(true)}
                className="w-full flex items-center justify-center gap-1 py-2 rounded hover:bg-[#F5F5F5]"
                style={{ color: selectedReaction ? reactionColor : '#757575' }}
              >
                <ReactionIcon className={`w-5 h-5 ${selectedReaction ? 'fill-current' : ''}`} />
                <span className="text-sm">{selectedReaction ? reactionTypes.find(r => r.id === selectedReaction)?.label : 'Like'}</span>
              </button>

              {/* Reaction Picker */}
              {showReactionPicker && (
                <div 
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 p-2 flex gap-1 z-50"
                  onMouseLeave={() => setShowReactionPicker(false)}
                >
                  {reactionTypes.map((reaction) => {
                    const Icon = reaction.icon;
                    return (
                      <button
                        key={reaction.id}
                        onClick={() => handleReaction(reaction.id)}
                        className="p-2 rounded-full hover:bg-[#F5F5F5] transition-transform hover:scale-125"
                        title={reaction.label}
                      >
                        <Icon className="w-6 h-6" style={{ color: reaction.color }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button className="flex items-center justify-center gap-1 py-2 rounded hover:bg-[#F5F5F5]">
              <MessageCircle className="w-5 h-5 text-[#757575]" />
              <span className="text-sm text-[#757575]">Comment</span>
            </button>

            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center justify-center gap-1 py-2 rounded hover:bg-[#F5F5F5]"
            >
              <Share2 className="w-5 h-5 text-[#757575]" />
              <span className="text-sm text-[#757575]">Share</span>
            </button>

            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center justify-center gap-1 py-2 rounded hover:bg-[#F5F5F5]"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#2E7D32] text-[#2E7D32]' : 'text-[#757575]'}`} />
              <span className={`text-sm ${isSaved ? 'text-[#2E7D32]' : 'text-[#757575]'}`}>Save</span>
            </button>
          </div>
        </article>

        {/* Reactions List */}
        {showReactions && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h4 className="mb-3">Reactions</h4>
            {isLoadingReactors ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
              </div>
            ) : reactors.length === 0 ? (
              <p className="text-sm text-[#757575] text-center py-4">No reactions yet</p>
            ) : (
              <div className="space-y-3">
                {reactors.map((reactor, idx) => {
                  const reactionType = reactionTypes.find(r => r.id === reactor.type);
                  const Icon = reactionType?.icon || ThumbsUp;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <img src={reactor.avatar} alt={reactor.name} className="w-full h-full object-cover" />
                        </Avatar>
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                          style={{ backgroundColor: reactionType?.color }}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">{reactor.name}</p>
                        <p className="text-xs text-[#757575]">{reactor.organization}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Share Menu */}
        {showShareMenu && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h4>Share post</h4>
              <button onClick={() => setShowShareMenu(false)}>
                <X className="w-5 h-5 text-[#757575]" />
              </button>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F5F5]">
                Share in a message
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F5F5]">
                Share to a workspace
              </button>
              <button 
                onClick={handleCopyLink}
                className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F5F5]"
              >
                Copy link
              </button>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h4>Comments ({comments.length})</h4>
          </div>
          
          {/* Add Comment */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2">
              <Avatar className="w-10 h-10">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" alt="You" className="w-full h-full object-cover" />
              </Avatar>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#2E7D32]"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-[#2E7D32] text-white text-sm rounded-full hover:bg-[#1B5E20] disabled:bg-[#BDBDBD] disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <div key={comment.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm">{comment.author.name}</h4>
                        <span className="text-xs text-[#757575]">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#757575] mb-2">{comment.author.organization}</p>
                      
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2E7D32] resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveComment(comment.id)}
                              className="px-3 py-1 bg-[#2E7D32] text-white text-xs rounded hover:bg-[#1B5E20]"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingComment(null);
                                setEditCommentText('');
                              }}
                              className="px-3 py-1 border border-gray-300 text-xs rounded hover:bg-[#F5F5F5]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-[#212121] leading-snug mb-2">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-3">
                            <button className="text-xs text-[#757575] hover:text-[#2E7D32]">Like</button>
                            <button className="text-xs text-[#757575] hover:text-[#2E7D32]">Reply</button>
                            {comment.isOwn && (
                              <>
                                <button 
                                  onClick={() => handleEditComment(comment.id)}
                                  className="text-xs text-[#757575] hover:text-[#2E7D32]"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-xs text-[#D32F2F] hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="mb-2">Delete post?</h3>
            <p className="text-sm text-[#757575] mb-6">
              This action cannot be undone. Your post will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-[#F5F5F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 px-4 py-2 bg-[#D32F2F] text-white rounded hover:bg-[#B71C1C]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}