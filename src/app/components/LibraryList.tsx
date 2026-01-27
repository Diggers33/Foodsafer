import { useState } from 'react';
import { ArrowLeft, Search, Filter, FileText, Download, Eye, Bookmark, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

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
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'FDA Food Safety Modernization Act (FSMA) Guide',
    description: 'Complete guide to understanding and implementing FSMA requirements',
    category: 'Regulations',
    type: 'PDF',
    size: '2.4 MB',
    downloads: 4523,
    publishDate: '2026-01-05',
    publisher: 'FDA',
  },
  {
    id: '2',
    title: 'Allergen Control Best Practices Whitepaper',
    description: 'Industry best practices for allergen management and control',
    category: 'Best Practices',
    type: 'PDF',
    size: '1.8 MB',
    downloads: 3214,
    publishDate: '2026-01-03',
    publisher: 'Global Food Standards',
  },
  {
    id: '3',
    title: 'ISO 22000:2018 Standard Documentation',
    description: 'Official ISO 22000 food safety management system standard',
    category: 'Standards',
    type: 'PDF',
    size: '3.2 MB',
    downloads: 5678,
    publishDate: '2025-12-28',
    publisher: 'ISO',
  },
  {
    id: '4',
    title: 'HACCP Plan Template',
    description: 'Customizable template for creating comprehensive HACCP plans',
    category: 'Templates',
    type: 'DOC',
    size: '856 KB',
    downloads: 8934,
    publishDate: '2025-12-20',
    publisher: 'FoodSafer Community',
  },
  {
    id: '5',
    title: 'Food Safety Audit Checklist',
    description: 'Comprehensive checklist for conducting internal food safety audits',
    category: 'Templates',
    type: 'XLS',
    size: '645 KB',
    downloads: 6432,
    publishDate: '2025-12-15',
    publisher: 'FoodSafer Community',
  },
  {
    id: '6',
    title: 'Sanitation SOP Template Package',
    description: 'Complete set of sanitation standard operating procedure templates',
    category: 'Templates',
    type: 'DOC',
    size: '1.2 MB',
    downloads: 5123,
    publishDate: '2025-12-10',
    publisher: 'SafeFood Consulting',
  },
  {
    id: '7',
    title: 'Global Food Safety Initiative (GFSI) Overview',
    description: 'Comprehensive overview of GFSI benchmarked schemes',
    category: 'Standards',
    type: 'PDF',
    size: '2.1 MB',
    downloads: 3456,
    publishDate: '2025-12-05',
    publisher: 'GFSI',
  },
  {
    id: '8',
    title: 'Traceability Implementation Presentation',
    description: 'Step-by-step guide to implementing food traceability systems',
    category: 'Best Practices',
    type: 'PPT',
    size: '4.5 MB',
    downloads: 2789,
    publishDate: '2025-11-28',
    publisher: 'FoodTech Innovations',
  },
];

export function LibraryList({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [savedDocs, setSavedDocs] = useState<Set<string>>(new Set());

  const filteredDocs = activeTab === 'saved'
    ? mockDocuments.filter(d => savedDocs.has(d.id))
    : mockDocuments;

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
        {filteredDocs.length === 0 && activeTab === 'saved' ? (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 text-[#757575] mx-auto mb-3" />
            <p className="text-[#757575]">No saved documents yet</p>
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
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#9C27B0] text-white rounded-lg hover:bg-[#7B1FA2] text-sm">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-[#9C27B0] text-[#9C27B0] rounded-lg hover:bg-[#F3E5F5] text-sm">
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
