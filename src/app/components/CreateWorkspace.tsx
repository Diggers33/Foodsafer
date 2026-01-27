import { useState } from 'react';
import { ArrowLeft, Upload, X, Globe, Lock } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

interface CreateWorkspaceProps {
  onBack: () => void;
}

export function CreateWorkspace({ onBack }: CreateWorkspaceProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreate = () => {
    // Create workspace logic here
    console.log({ name, description, isPublic, tags, thumbnail });
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#757575]" />
            </button>
            <h2>Create Workspace</h2>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="px-4 py-4 space-y-4">
        {/* Thumbnail Upload */}
        <div className="bg-white rounded-lg p-4">
          <label className="text-sm text-[#757575] mb-2 block">Workspace Image</label>
          {thumbnail ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img src={thumbnail} alt="Workspace thumbnail" className="w-full h-full object-cover" />
              <button
                onClick={() => setThumbnail(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setThumbnail('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop')}
              className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
            >
              <Upload className="w-8 h-8 text-[#757575]" />
              <span className="text-sm text-[#757575]">Upload workspace image</span>
            </button>
          )}
        </div>

        {/* Workspace Name */}
        <div className="bg-white rounded-lg p-4">
          <label className="text-sm text-[#757575] mb-2 block">Workspace Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., HACCP Implementation Team"
            className="bg-[#F5F5F5] border-none"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-4">
          <label className="text-sm text-[#757575] mb-2 block">Description *</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose and goals of this workspace..."
            className="min-h-[120px] bg-[#F5F5F5] border-none"
          />
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg p-4">
          <label className="text-sm text-[#757575] mb-2 block">Tags</label>
          
          {/* Tag Input */}
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag..."
              className="flex-1 bg-[#F5F5F5] border-none"
            />
            <Button
              onClick={handleAddTag}
              variant="outline"
              className="px-6 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"
            >
              Add
            </Button>
          </div>

          {/* Tag List */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] text-xs flex items-center gap-1 pr-1"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="w-4 h-4 flex items-center justify-center hover:bg-[#2E7D32] hover:text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {isPublic ? (
                <Globe className="w-5 h-5 text-[#2196F3] mt-0.5 flex-shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-[#757575] mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="mb-1">{isPublic ? 'Public Workspace' : 'Private Workspace'}</h4>
                <p className="text-sm text-[#757575] leading-relaxed">
                  {isPublic
                    ? 'Anyone can discover and join this workspace'
                    : 'Only invited members can access this workspace'}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#E3F2FD] border border-[#2196F3]/20 rounded-lg p-4">
          <p className="text-sm text-[#1976D2] leading-relaxed">
            <strong>Tip:</strong> Add relevant tags to help others discover your workspace. You can invite members after creation.
          </p>
        </div>
      </div>

      {/* Fixed Create Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <Button
          onClick={handleCreate}
          disabled={!name.trim() || !description.trim()}
          className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#BDBDBD] disabled:cursor-not-allowed"
        >
          Create Workspace
        </Button>
      </div>
    </div>
  );
}
