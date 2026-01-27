import { useState } from 'react';
import { ArrowLeft, Edit, MoreVertical, Lock, Globe, X, Save } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
}

const mockNote = {
  id: '1',
  title: 'HACCP Critical Control Points Summary',
  content: `Key CCPs identified during the last facility audit:

1. Cooking Temperature Monitoring
   - Critical Limit: Internal temperature must reach 165°F (74°C)
   - Monitoring: Digital thermometers checked every 30 minutes
   - Corrective Action: Extend cooking time if temperature not met

2. Cold Storage Temperature Checks
   - Critical Limit: Storage temperature must be maintained at 40°F (4°C) or below
   - Monitoring: Automated temperature logging every 15 minutes
   - Corrective Action: Immediate equipment check and product hold

3. Metal Detector Verification
   - Critical Limit: All metal contaminants >2mm must be detected
   - Monitoring: Test with standard metal samples every 2 hours
   - Corrective Action: Production stop, equipment recalibration

4. Allergen Cleaning Verification
   - Critical Limit: ATP testing <100 RLU on food contact surfaces
   - Monitoring: Swab testing between allergen runs
   - Corrective Action: Re-clean and retest until passing

Action Items:
- Schedule training session for new CCP procedures
- Update documentation templates
- Review with quality team by end of week`,
  author: {
    name: 'Dr. Maria Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
  },
  created: 'January 3, 2026',
  lastEdited: '2 hours ago',
  isPublic: true,
};

export function NoteDetail({ noteId, onBack }: NoteDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(mockNote.title);
  const [content, setContent] = useState(mockNote.content);
  const [isPublic, setIsPublic] = useState(mockNote.isPublic);

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)}>
                <X className="w-6 h-6 text-[#757575]" />
              </button>
              <h2>Edit Note</h2>
              <button onClick={handleSave}>
                <Save className="w-6 h-6 text-[#2E7D32]" />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <button onClick={onBack}>
                  <ArrowLeft className="w-6 h-6 text-[#757575]" />
                </button>
                <h2>Note</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsEditing(true)}>
                  <Edit className="w-6 h-6 text-[#757575]" />
                </button>
                <button>
                  <MoreVertical className="w-6 h-6 text-[#757575]" />
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {isEditing ? (
        /* Edit Mode */
        <div className="px-4 py-4 space-y-4">
          {/* Title Input */}
          <div>
            <label className="text-sm text-[#757575] mb-2 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="bg-white"
            />
          </div>

          {/* Content Input */}
          <div>
            <label className="text-sm text-[#757575] mb-2 block">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="min-h-[400px] bg-white"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-[#2E7D32]" />
              ) : (
                <Lock className="w-5 h-5 text-[#757575]" />
              )}
              <div>
                <h4 className="text-sm">{isPublic ? 'Public Note' : 'Private Note'}</h4>
                <p className="text-xs text-[#757575]">
                  {isPublic ? 'Visible to all workspace members' : 'Only you can see this'}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {/* Auto-save indicator */}
          <p className="text-xs text-[#757575] text-center">Changes auto-saved</p>
        </div>
      ) : (
        /* View Mode */
        <div className="bg-white px-4 py-4 mb-20">
          {/* Title */}
          <h1 className="mb-4">{mockNote.title}</h1>

          {/* Author and Meta */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <Avatar className="w-8 h-8">
              <img src={mockNote.author.avatar} alt={mockNote.author.name} className="w-full h-full object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm">{mockNote.author.name}</h4>
              <p className="text-xs text-[#757575]">
                Created {mockNote.created} • Edited {mockNote.lastEdited}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={`${
                mockNote.isPublic
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-[#F5F5F5] text-[#757575]'
              } flex items-center gap-1`}
            >
              {mockNote.isPublic ? (
                <>
                  <Globe className="w-3 h-3" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Private
                </>
              )}
            </Badge>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <div className="text-[#212121] leading-relaxed whitespace-pre-line">
              {mockNote.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
