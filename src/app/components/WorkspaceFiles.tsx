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

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'HACCP Protocols',
    type: 'folder',
    modifiedDate: '2 days ago',
    uploadedBy: 'Maria Rodriguez',
  },
  {
    id: '2',
    name: 'Audit Reports',
    type: 'folder',
    modifiedDate: '1 week ago',
    uploadedBy: 'James Chen',
  },
  {
    id: '3',
    name: 'HACCP_Allergen_Protocol_v3.pdf',
    type: 'pdf',
    size: '2.4 MB',
    modifiedDate: '2 hours ago',
    uploadedBy: 'Maria Rodriguez',
  },
  {
    id: '4',
    name: 'FDA_Guidelines_Summary.pdf',
    type: 'pdf',
    size: '1.8 MB',
    modifiedDate: '3 days ago',
    uploadedBy: 'Sarah Johnson',
  },
  {
    id: '5',
    name: 'Training_Schedule_Q1.xlsx',
    type: 'xlsx',
    size: '245 KB',
    modifiedDate: '5 days ago',
    uploadedBy: 'Emily Davis',
  },
  {
    id: '6',
    name: 'Facility_Layout.jpg',
    type: 'image',
    size: '3.1 MB',
    modifiedDate: '1 week ago',
    uploadedBy: 'Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&h=300&fit=crop',
  },
  {
    id: '7',
    name: 'Meeting_Minutes_Jan_2026.docx',
    type: 'doc',
    size: '156 KB',
    modifiedDate: '2 days ago',
    uploadedBy: 'Sarah Johnson',
  },
];

export function WorkspaceFiles({ workspaceId }: WorkspaceFilesProps) {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [currentPath, setCurrentPath] = useState('Workspace Files');

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
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Filter Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
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
            <button>
              <Upload className="w-5 h-5 text-[#757575]" />
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button className="text-[#2E7D32]">Workspace</button>
          <span className="text-[#757575]">/</span>
          <span className="text-[#212121]">{currentPath}</span>
        </div>
      </div>

      {/* Files List View */}
      {view === 'list' && (
        <div className="px-4 py-4 space-y-2">
          {mockFiles.map((file) => (
            <FileListItem key={file.id} file={file} getFileIcon={getFileIcon} />
          ))}
        </div>
      )}

      {/* Files Grid View */}
      {view === 'grid' && (
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          {mockFiles.map((file) => (
            <FileGridItem key={file.id} file={file} getFileIcon={getFileIcon} />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full shadow-lg flex items-center justify-center z-40">
        <Upload className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

function FileListItem({ 
  file, 
  getFileIcon 
}: { 
  file: FileItem; 
  getFileIcon: (type: string) => React.ReactNode;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <article className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
      {/* Icon/Thumbnail */}
      <div className="flex-shrink-0">
        {file.type === 'image' && file.thumbnail ? (
          <div className="w-12 h-12 rounded overflow-hidden">
            <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="truncate text-sm mb-1">{file.name}</h4>
        <div className="flex items-center gap-2 text-xs text-[#757575]">
          {file.size && <span>{file.size}</span>}
          {file.size && <span>•</span>}
          <span>{file.modifiedDate}</span>
          <span>•</span>
          <span>{file.uploadedBy}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {file.type !== 'folder' && (
          <>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
              <Download className="w-4 h-4 text-[#757575]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
              <Share2 className="w-4 h-4 text-[#757575]" />
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function FileGridItem({ 
  file, 
  getFileIcon 
}: { 
  file: FileItem; 
  getFileIcon: (type: string) => React.ReactNode;
}) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail/Preview */}
      <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center relative">
        {file.type === 'image' && file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="scale-150">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm truncate mb-1">{file.name}</h4>
        <div className="text-xs text-[#757575] space-y-0.5">
          {file.size && <p>{file.size}</p>}
          <p>{file.modifiedDate}</p>
        </div>
      </div>
    </article>
  );
}
