import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, MoreVertical, Lock, Globe, X, Save, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { api } from '@/api';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  created: string;
  lastEdited: string;
  isPublic: boolean;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function formatDate(dateString: string): string {
  if (!dateString) return '';
  let date: Date;
  const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    date = new Date(`${year}-${month}-${day}`);
  } else {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

function mapNote(n: any): Note {
  const creator = n.creator || n.author || {};
  const authorName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || 'Unknown';
  const avatar = creator.avatar ? (creator.avatar.startsWith('http') ? creator.avatar : `${API_BASE}${creator.avatar}`) : '';

  return {
    id: n.id,
    title: n.title || n.name || 'Untitled',
    content: n.content || n.text || n.description || '',
    author: { name: authorName, avatar },
    created: formatDate(n.createdAt),
    lastEdited: formatTimeAgo(n.updatedAt || n.createdAt),
    isPublic: n.isPublic ?? true,
  };
}

export function NoteDetail({ noteId, onBack }: NoteDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const fetchNote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/queries/notes/${noteId}`);
      const mappedNote = mapNote(data);
      setNote(mappedNote);
      setTitle(mappedNote.title);
      setContent(mappedNote.content);
      setIsPublic(mappedNote.isPublic);
    } catch (err) {
      console.error('Failed to load note:', err);
      setError(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#757575]" />
            </button>
            <h2 className="ml-3">Note</h2>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'Note not found'}</p>
        </div>
      </div>
    );
  }

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
          <h1 className="mb-4">{note.title}</h1>

          {/* Author and Meta */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <Avatar className="w-8 h-8">
              <img src={note.author.avatar} alt={note.author.name} className="w-full h-full object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm">{note.author.name}</h4>
              <p className="text-xs text-[#757575]">
                Created {note.created} • Edited {note.lastEdited}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={`${
                note.isPublic
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-[#F5F5F5] text-[#757575]'
              } flex items-center gap-1`}
            >
              {note.isPublic ? (
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
          <div
            className="prose prose-sm max-w-none text-[#212121] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      )}
    </div>
  );
}
