import { useState, useRef, useEffect } from 'react';
import { X, ImageIcon, FileText, Video, Smile, AtSign, Hash } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface LinkedInStylePostProps {
  onClose: () => void;
  onPost: (postData: any) => void;
  initialData?: {
    content: string;
    images: string[];
    tags: string[];
  };
  isEditing?: boolean;
}

interface DraftData {
  content: string;
  images: string[];
  documents: { name: string; url: string; size?: string }[];
  videos: { name: string; url: string }[];
  selectedTags: string[];
  timestamp: number;
}

const emojis = ['👍', '❤️', '🎉', '💡', '🔥', '✅', '📊', '🎯', '💯', '🚀', '🏆', '⭐', '🌟', '💪', '👏', '🙌', '✨'];

const mentionSuggestions = [
  { name: 'Dr. Maria Rodriguez', org: 'Global Food Standards' },
  { name: 'James Chen', org: 'SafeFood Consulting' },
  { name: 'Sarah Williams', org: 'FoodTech Innovations' },
  { name: 'Michael Brown', org: 'FDA Inspector' },
];

const DRAFT_KEY = 'foodsafer_post_draft';

export function LinkedInStylePost({ onClose, onPost, initialData, isEditing = false }: LinkedInStylePostProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [documents, setDocuments] = useState<{ name: string; url: string; size?: string }[]>([]);
  const [videos, setVideos] = useState<{ name: string; url: string }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');

  // Draft and confirmation state
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const characterLimit = 3000;
  const charCount = content.length;

  const suggestedHashtags = ['HACCP', 'FoodSafety', 'QualityControl', 'Allergens', 'Compliance', 'Training', 'Audit', 'Certification'];

  // Load draft on mount if not editing and no initial data
  useEffect(() => {
    if (!isEditing && !initialData) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          const draft: DraftData = JSON.parse(savedDraft);
          setContent(draft.content);
          setImages(draft.images);
          setDocuments(draft.documents);
          setVideos(draft.videos);
          setSelectedTags(draft.selectedTags);
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, [isEditing, initialData]);

  const hasContent = () => {
    return content.trim() || images.length > 0 || documents.length > 0 || videos.length > 0 || selectedTags.length > 0;
  };

  const saveDraft = () => {
    const draft: DraftData = {
      content,
      images,
      documents,
      videos,
      selectedTags,
      timestamp: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  const handleClose = () => {
    if (hasContent() && !isEditing) {
      setShowCancelDialog(true);
    } else {
      onClose();
    }
  };

  const handleCancelConfirm = () => {
    clearDraft();
    setShowCancelDialog(false);
    onClose();
  };

  const handleSaveDraftAndClose = () => {
    saveDraft();
    setShowCancelDialog(false);
    onClose();
  };

  const handleAddImage = () => {
    if (imageInputRef.current?.files && imageInputRef.current.files.length > 0) {
      const files = Array.from(imageInputRef.current.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      // Reset the input so the same file can be selected again
      imageInputRef.current.value = '';
    }
  };

  const handleAddVideo = () => {
    if (videoInputRef.current?.files && videoInputRef.current.files.length > 0) {
      const files = Array.from(videoInputRef.current.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideos(prev => [...prev, { name: file.name, url: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
      // Reset the input so the same file can be selected again
      videoInputRef.current.value = '';
    }
  };

  const handleAddDocument = () => {
    if (docInputRef.current?.files && docInputRef.current.files.length > 0) {
      const files = Array.from(docInputRef.current.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDocuments(prev => [...prev, { name: file.name, url: reader.result as string, size: file.size.toString() }]);
        };
        reader.readAsDataURL(file);
      });
      // Reset the input so the same file can be selected again
      docInputRef.current.value = '';
    }
  };

  const handleAddHashtag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setContent(content + ` #${tag}`);
    }
  };

  const handleAddCustomHashtag = () => {
    const tag = hashtagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setContent(content + ` #${tag}`);
      setHashtagInput('');
    }
  };

  const insertEmoji = (emoji: string) => {
    setContent(content + emoji);
    setShowEmojiPicker(false);
  };

  const insertMention = (name: string) => {
    setContent(content + `@${name} `);
    setShowMentions(false);
  };

  const handlePost = () => {
    const postData = {
      content,
      images,
      documents,
      videos,
      tags: selectedTags,
    };
    onPost(postData);
  };

  const isPostValid = () => {
    return content.trim().length > 0;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={handleClose}>
            <X className="w-6 h-6 text-[#212121]" />
          </button>
          <h1>Create Post</h1>
          <button 
            onClick={handlePost}
            className="text-[#36B9D0] font-semibold disabled:text-[#BDBDBD] disabled:cursor-not-allowed"
            disabled={!isPostValid()}
          >
            Post
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* User Info */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" alt="You" className="w-full h-full object-cover" />
            </Avatar>
            <div className="flex-1">
              <h4>You</h4>
              <p className="text-sm text-[#757575]">Public</p>
            </div>
          </div>

          {/* Content */}
          <textarea
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, characterLimit))}
            className="w-full h-48 resize-none focus:outline-none text-[#212121]"
            autoFocus
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-1">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Smile className="w-5 h-5 text-[#757575]" />
              </button>
              <button
                onClick={() => setShowMentions(!showMentions)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <AtSign className="w-5 h-5 text-[#757575]" />
              </button>
              <button
                onClick={() => setShowHashtagInput(!showHashtagInput)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Hash className="w-5 h-5 text-[#757575]" />
              </button>
            </div>
            <span className={`text-xs ${charCount > characterLimit * 0.9 ? 'text-[#D32F2F]' : 'text-[#757575]'}`}>
              {charCount}/{characterLimit}
            </span>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mt-3 p-3 bg-[#F5F5F5] rounded-lg">
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    className="text-2xl hover:bg-white p-2 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mentions Suggestions */}
          {showMentions && (
            <div className="mt-3 p-3 bg-[#F5F5F5] rounded-lg space-y-2">
              {mentionSuggestions.map((person, idx) => (
                <button
                  key={idx}
                  onClick={() => insertMention(person.name)}
                  className="w-full flex items-center gap-3 p-2 rounded hover:bg-white text-left"
                >
                  <Avatar className="w-8 h-8">
                    <div className="w-full h-full bg-[#36B9D0] flex items-center justify-center text-white text-sm">
                      {person.name[0]}
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm">{person.name}</p>
                    <p className="text-xs text-[#757575]">{person.org}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hashtag Section */}
        {showHashtagInput && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm mb-2">Add hashtags</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedHashtags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  onClick={() => handleAddHashtag(tag)}
                  className={`cursor-pointer ${
                    selectedTags.includes(tag)
                      ? 'bg-[#E0F7FA] text-[#36B9D0] border-[#36B9D0]'
                      : 'hover:bg-[#E0F7FA] hover:text-[#36B9D0] hover:border-[#36B9D0]'
                  }`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Create custom hashtag..."
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomHashtag();
                  }
                }}
                className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
              />
              <button
                onClick={handleAddCustomHashtag}
                disabled={!hashtagInput.trim()}
                className="px-4 py-2 bg-[#36B9D0] text-white text-sm rounded hover:bg-[#2A8FA3] disabled:bg-[#BDBDBD] disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Media Attachments */}
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-sm mb-3">Add to your post</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center gap-1 p-3 border border-gray-300 rounded hover:bg-[#F5F5F5]"
            >
              <ImageIcon className="w-5 h-5 text-[#36B9D0]" />
              <span className="text-xs text-[#757575]">Image</span>
            </button>
            <button
              onClick={() => docInputRef.current?.click()}
              className="flex flex-col items-center gap-1 p-3 border border-gray-300 rounded hover:bg-[#F5F5F5]"
            >
              <FileText className="w-5 h-5 text-[#36B9D0]" />
              <span className="text-xs text-[#757575]">File</span>
            </button>
            <button
              onClick={() => videoInputRef.current?.click()}
              className="flex flex-col items-center gap-1 p-3 border border-gray-300 rounded hover:bg-[#F5F5F5]"
            >
              <Video className="w-5 h-5 text-[#36B9D0]" />
              <span className="text-xs text-[#757575]">Video</span>
            </button>
          </div>
        </div>

        {/* Image Input */}
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          multiple
          onChange={handleAddImage}
          className="hidden"
        />

        {/* Video Input */}
        <input
          type="file"
          ref={videoInputRef}
          accept="video/*"
          multiple
          onChange={handleAddVideo}
          className="hidden"
        />

        {/* Document Input */}
        <input
          type="file"
          ref={docInputRef}
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onChange={handleAddDocument}
          className="hidden"
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm mb-2">Images ({images.length})</h4>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-[#D32F2F] text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Previews */}
        {videos.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm mb-2">Videos</h4>
            <div className="space-y-2">
              {videos.map((video, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-[#F5F5F5] rounded">
                  <Video className="w-5 h-5 text-[#36B9D0]" />
                  <span className="flex-1 text-sm truncate">{video.name}</span>
                  <button
                    onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                    className="text-[#D32F2F]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Previews */}
        {documents.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm mb-2">Documents</h4>
            <div className="space-y-2">
              {documents.map((doc, idx) => {
                const { name } = doc;
                return (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-[#F5F5F5] rounded">
                    <FileText className="w-5 h-5 text-[#36B9D0]" />
                    <span className="flex-1 text-sm truncate">{name}</span>
                    <button
                      onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                      className="text-[#D32F2F]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}</div>
          </div>
        )}
      </div>

      {/* Draft Save Confirmation */}
      {draftSaved && (
        <div className="absolute bottom-4 right-4 bg-[#36B9D0] text-white px-4 py-2 rounded shadow-lg">
          Draft saved
        </div>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard post?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleSaveDraftAndClose}
              className="bg-[#36B9D0] hover:bg-[#2A8FA3] w-full"
            >
              Save Draft
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-[#D32F2F] hover:bg-[#C62828] w-full"
            >
              Discard
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">Keep Editing</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}