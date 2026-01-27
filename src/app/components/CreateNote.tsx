import { useState } from 'react';
import { X, Hash } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface CreateNoteProps {
  onClose: () => void;
  workspaceId: string;
}

export function CreateNote({ onClose }: CreateNoteProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const suggestedTags = ['HACCP', 'SOP', 'Training', 'Audit', 'Compliance', 'Inspection', 'Recipe', 'Protocol'];

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleCreate = () => {
    const noteData = {
      title,
      content,
      tags: selectedTags,
      timestamp: new Date().toISOString(),
    };
    console.log('Creating note:', noteData);
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
          <h1>New Note</h1>
          <button 
            onClick={handleCreate}
            className="text-[#2E7D32] font-semibold disabled:text-[#BDBDBD] disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            Save
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
              <p className="text-sm text-[#757575]">Creating a note</p>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-0 py-2 text-xl border-b border-gray-300 focus:outline-none focus:border-[#2E7D32]"
              autoFocus
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 px-0 py-2 resize-none focus:outline-none text-[#212121]"
            />
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-4">
              <label className="text-sm text-[#757575] mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    #{tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Tags */}
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-sm mb-3 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Add tags
          </h4>

          {/* Suggested Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                onClick={() => handleAddTag(tag)}
                className={`cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]'
                    : 'hover:bg-[#E8F5E9] hover:text-[#2E7D32] hover:border-[#2E7D32]'
                }`}
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Custom Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Create custom tag..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2E7D32]"
            />
            <button
              onClick={handleAddCustomTag}
              disabled={!customTag.trim()}
              className="px-4 py-2 bg-[#2E7D32] text-white text-sm rounded hover:bg-[#1B5E20] disabled:bg-[#BDBDBD] disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
