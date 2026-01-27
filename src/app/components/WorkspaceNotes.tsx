import { useState } from 'react';
import { Search, SortAsc, Plus, Lock, Globe } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { NoteDetail } from './NoteDetail';

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

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'HACCP Critical Control Points Summary',
    preview: 'Key CCPs identified during the last facility audit: 1. Cooking temperature monitoring, 2. Cold storage temperature checks, 3. Metal detector verification...',
    author: {
      name: 'Dr. Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    lastEdited: '2h ago',
    isPublic: true,
  },
  {
    id: '2',
    title: 'Meeting Notes - Jan 3 Protocol Review',
    preview: 'Attendees: Maria, James, Sarah, Emily. Agenda items covered: New FDA guidelines review, Implementation timeline discussion, Budget allocation...',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    lastEdited: '1d ago',
    isPublic: false,
  },
  {
    id: '3',
    title: 'Supplier Audit Checklist',
    preview: 'Documentation requirements: 1. Food safety certifications, 2. HACCP plans, 3. Allergen management procedures, 4. Traceability systems...',
    author: {
      name: 'James Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    lastEdited: '3d ago',
    isPublic: true,
  },
  {
    id: '4',
    title: 'Training Session Ideas',
    preview: 'Topics for next quarter: Personal hygiene refresher, Cross-contamination prevention, Proper cleaning procedures, Emergency response protocols...',
    author: {
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    },
    lastEdited: '1w ago',
    isPublic: false,
  },
];

export function WorkspaceNotes({ workspaceId }: WorkspaceNotesProps) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  if (selectedNote) {
    return <NoteDetail noteId={selectedNote} onBack={() => setSelectedNote(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
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
        <span className="text-sm text-[#757575]">{mockNotes.length} notes</span>
      </div>

      {/* Notes List */}
      <div className="px-4 py-4 space-y-3">
        {mockNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => setSelectedNote(note.id)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full shadow-lg flex items-center justify-center z-40">
        <Plus className="w-6 h-6 text-white" />
      </button>
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
