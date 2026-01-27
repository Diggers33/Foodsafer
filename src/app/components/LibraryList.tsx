import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, FileText, Download, Eye, Bookmark, Calendar, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { api } from '@/api';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'PDF' | 'DOC' | 'XLS' | 'PPT';
  size: string;
  downloads: number;
  publishDate: string;
  publisher: string;
  fileUrl: string;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function formatFileSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(filename: string): 'PDF' | 'DOC' | 'XLS' | 'PPT' {
  const ext = (filename || '').split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'PDF';
  if (ext === 'doc' || ext === 'docx') return 'DOC';
  if (ext === 'xls' || ext === 'xlsx') return 'XLS';
  if (ext === 'ppt' || ext === 'pptx') return 'PPT';
  return 'PDF';
}

function mapDocument(item: any): Document {
  const creator = item.creator || item.author || {};
  const creatorName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim();

  // Get file URL - handle relative paths
  const rawUrl = item.url || item.fileUrl || item.file || item.path || '';
  const fileUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${API_BASE}${rawUrl}`) : '';

  return {
    id: item.id,
    title: item.title || item.name || 'Untitled',
    description: item.description || item.content || '',
    category: item.category || item.type || 'Document',
    type: getFileType(item.filename || item.name || ''),
    size: formatFileSize(item.size || item.fileSize || 0),
    downloads: item.downloads || item.downloadCount || 0,
    publishDate: item.createdAt || item.publishDate || '',
    publisher: creatorName || item.publisher || 'Unknown',
    fileUrl,
  };
}

export function LibraryList({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [savedDocs, setSavedDocs] = useState<Set<string>>(new Set());
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>('/queries/libraries');
      const docs = Array.isArray(data) ? data.map(mapDocument) : [];
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocs = activeTab === 'saved'
    ? documents.filter(d => savedDocs.has(d.id))
    : documents;

  const toggleSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSaved = new Set(savedDocs);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedDocs(newSaved);
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-[#D32F2F] text-white';
      case 'DOC':
        return 'bg-[#2196F3] text-white';
      case 'XLS':
        return 'bg-[#4CAF50] text-white';
      case 'PPT':
        return 'bg-[#FF9800] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-[#212121]" />
              </button>
              <h1>Library</h1>
            </div>
            <div className="flex items-center gap-3">
              <button>
                <Search className="w-6 h-6 text-[#757575]" />
              </button>
              <button>
                <Filter className="w-6 h-6 text-[#757575]" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 bg-[#F5F5F5]">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#9C27B0]">
                All Documents
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-white data-[state=active]:text-[#9C27B0]">
                Saved
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#9C27B0]" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : filteredDocs.length === 0 && activeTab === 'saved' ? (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 text-[#757575] mx-auto mb-3" />
            <p className="text-[#757575]">No saved documents yet</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#757575] mx-auto mb-3" />
            <p className="text-[#757575]">No documents available</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <article
              key={doc.id}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex gap-4">
                {/* File Icon */}
                <div className={`w-12 h-12 rounded-lg ${getFileTypeColor(doc.type)} flex items-center justify-center flex-shrink-0`}>
                  <FileText className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="line-clamp-2 flex-1">{doc.title}</h3>
                    <button onClick={(e) => toggleSaved(doc.id, e)}>
                      <Bookmark
                        className={`w-5 h-5 flex-shrink-0 ${
                          savedDocs.has(doc.id)
                            ? 'fill-[#9C27B0] text-[#9C27B0]'
                            : 'text-[#757575]'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-[#757575] line-clamp-2 mb-3">
                    {doc.description}
                  </p>

                  {/* Category Badge */}
                  <Badge
                    variant="secondary"
                    className="bg-[#F3E5F5] text-[#9C27B0] hover:bg-[#E1BEE7] mb-3"
                  >
                    {doc.category}
                  </Badge>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-[#757575] mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`${getFileTypeColor(doc.type)} px-2 py-0.5 rounded`}>
                        {doc.type}
                      </span>
                      <span>{doc.size}</span>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{doc.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Publisher and Date */}
                  <div className="flex items-center justify-between text-xs text-[#757575] mb-3">
                    <span>Published by {doc.publisher}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(doc.publishDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.fileUrl}
                      download
                      onClick={(e) => {
                        if (!doc.fileUrl) {
                          e.preventDefault();
                          alert('File not available for download');
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#9C27B0] text-white rounded-lg hover:bg-[#7B1FA2] text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                    <button
                      onClick={() => {
                        if (doc.fileUrl) {
                          window.open(doc.fileUrl, '_blank');
                        } else {
                          alert('Preview not available');
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-[#9C27B0] text-[#9C27B0] rounded-lg hover:bg-[#F3E5F5] text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Upload Banner */}
      <div className="mx-4 my-4 bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] rounded-lg p-4 text-white">
        <h3 className="text-white mb-2">Contribute to the Library</h3>
        <p className="text-white/90 text-sm mb-3">
          Share your documents and resources with the food safety community
        </p>
        <button className="w-full bg-white text-[#9C27B0] px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
          Upload Document
        </button>
      </div>
    </div>
  );
}
