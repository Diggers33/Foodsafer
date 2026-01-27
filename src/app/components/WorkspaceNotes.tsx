import { useState, useEffect } from 'react';
import { Search, SortAsc, Plus, Lock, Globe, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { NoteDetail } from './NoteDetail';
import { api } from '@/api';

interface WorkspaceNotesProps {
  workspaceId: string;
}

interface Note {
  id: string;
  title: string;
  preview: string;
  author: {
    name: string;
    avatar: string;
  };
  lastEdited: string;
  isPublic: boolean;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

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
  const avatar = creator.avatar ?
    (creator.avatar.startsWith('http') ? creator.avatar : `${API_BASE}${creator.avatar}`) : '';

  return {
    id: n.id,
    title: n.title || n.name || 'Untitled',
    preview: n.content || n.text || n.description || '',
    author: { name: authorName, avatar },
    lastEdited: formatTimeAgo(n.updatedAt || n.createdAt),
    isPublic: n.isPublic ?? true,
  };
}

export function WorkspaceNotes({ workspaceId }: WorkspaceNotesProps) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [workspaceId]);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>(`/queries/workspaces/${workspaceId}/notes`);
      const notesArray = Array.isArray(data) ? data : [];
      setNotes(notesArray.map(mapNote));
    } catch (err) {
      console.error('Failed to load notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedNote) {
    return <NoteDetail noteId={selectedNote} onBack={() => setSelectedNote(null)} />;
  }

  return (
    <div className="bg-[#F5F5F5]">
      {/* Filter Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button>
            <Search className="w-5 h-5 text-[#757575]" />
          </button>
          <button>
            <SortAsc className="w-5 h-5 text-[#757575]" />
          </button>
        </div>
        <span className="text-sm text-[#757575]">{notes.length} notes</span>
      </div>

      {/* Notes List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#757575]">No notes yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NoteCard({ note, onClick }: { note: Note; onClick: () => void }) {
  return (
    <article
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Title and Privacy Icon */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="flex-1 line-clamp-1">{note.title}</h3>
        {note.isPublic ? (
          <Globe className="w-4 h-4 text-[#757575] flex-shrink-0 ml-2" />
        ) : (
          <Lock className="w-4 h-4 text-[#757575] flex-shrink-0 ml-2" />
        )}
      </div>

      {/* Preview */}
      <p className="text-sm text-[#757575] mb-3 line-clamp-2 leading-relaxed">
        {note.preview}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <img src={note.author.avatar} alt={note.author.name} className="w-full h-full object-cover" />
        </Avatar>
        <span className="text-xs text-[#757575]">{note.author.name}</span>
        <span className="text-xs text-[#757575]">•</span>
        <span className="text-xs text-[#757575]">{note.lastEdited}</span>
      </div>
    </article>
  );
}
