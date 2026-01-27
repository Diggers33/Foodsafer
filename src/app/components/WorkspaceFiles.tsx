import { useState } from 'react';
import { Search, Grid3X3, List, Plus, Upload, Folder, File, FileText, Image as ImageIcon, Download, Share2, Trash2 } from 'lucide-react';

interface WorkspaceFilesProps {
  workspaceId: string;
}

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'doc' | 'image' | 'xlsx';
  size?: string;
  modifiedDate: string;
  uploadedBy: string;
  thumbnail?: string;
}

export function WorkspaceFiles({ workspaceId }: WorkspaceFilesProps) {
  const [view, setView] = useState<'list' | 'grid'>('list');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-5 h-5 text-[#FFC107]" />;
      case 'pdf':
        return <div className="w-8 h-8 bg-[#D32F2F] rounded flex items-center justify-center text-white text-xs">PDF</div>;
      case 'doc':
        return <div className="w-8 h-8 bg-[#2196F3] rounded flex items-center justify-center text-white text-xs">DOC</div>;
      case 'xlsx':
        return <div className="w-8 h-8 bg-[#4CAF50] rounded flex items-center justify-center text-white text-xs">XLS</div>;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-[#9C27B0]" />;
      default:
        return <File className="w-5 h-5 text-[#757575]" />;
    }
  };

  return (
    <div className="bg-[#F5F5F5]">
      {/* Filter Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button>
              <Search className="w-5 h-5 text-[#757575]" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('list')}
              className={view === 'list' ? 'text-[#2E7D32]' : 'text-[#757575]'}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={view === 'grid' ? 'text-[#2E7D32]' : 'text-[#757575]'}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state - Files API not yet connected */}
      <div className="px-4 py-8 text-center">
        <p className="text-[#757575]">No files yet</p>
      </div>
    </div>
  );
}

