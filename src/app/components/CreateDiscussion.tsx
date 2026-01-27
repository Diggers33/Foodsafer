import { useState, useRef } from 'react';
import { X, ImageIcon, FileText, Paperclip } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface CreateDiscussionProps {
  onClose: () => void;
  workspaceId: string;
}

export function CreateDiscussion({ onClose }: CreateDiscussionProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['General', 'Question', 'Announcement', 'Issue', 'Idea'];
  const characterLimit = 5000;

  const handleAddAttachment = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments([...attachments, { name: file.name, url: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    const discussionData = {
      title,
      content,
      category,
      attachments,
      timestamp: new Date().toISOString(),
    };
    console.log('Creating discussion:', discussionData);
    // In a real app, this would save to the backend
    onClose();
  };

  const isValid = title.trim() && content.trim();

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onClose}>
            <X className="w-6 h-6 text-[#212121]" />
          </button>
          <h1>New Discussion</h1>
          <button 
            onClick={handleCreate}
            className="text-[#36B9D0] font-semibold disabled:text-[#BDBDBD] disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            Post
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* User Info */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" alt="You" className="w-full h-full object-cover" />
            </Avatar>
            <div>
              <h4>You</h4>
              <p className="text-sm text-[#757575]">Starting a discussion</p>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label className="text-sm text-[#757575] mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  onClick={() => setCategory(cat.toLowerCase())}
                  className={`cursor-pointer ${
                    category === cat.toLowerCase()
                      ? 'bg-[#36B9D0] text-white hover:bg-[#2A8FA3]'
                      : 'bg-gray-200 text-[#757575] hover:bg-gray-300'
                  }`}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Discussion title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
              autoFocus
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <textarea
              placeholder="What would you like to discuss?"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, characterLimit))}
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:border-[#36B9D0]"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${content.length > characterLimit * 0.9 ? 'text-[#D32F2F]' : 'text-[#757575]'}`}>
                {content.length}/{characterLimit}
              </span>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-[#36B9D0] hover:bg-[#E0F7FA] px-3 py-2 rounded"
            >
              <Paperclip className="w-5 h-5" />
              <span className="text-sm">Add attachment</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAddAttachment}
              className="hidden"
            />
          </div>
        </div>

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm mb-2">Attachments</h4>
            <div className="space-y-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-[#F5F5F5] rounded">
                  <FileText className="w-5 h-5 text-[#36B9D0]" />
                  <span className="flex-1 text-sm truncate">{file.name}</span>
                  <button
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                    className="text-[#D32F2F]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
