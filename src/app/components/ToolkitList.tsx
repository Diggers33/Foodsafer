import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, ExternalLink, Star, Download, Users, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { api } from '@/api';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  rating: number;
  downloads: number;
  isPremium: boolean;
  url: string;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function mapTool(t: any): Tool {
  const icon = t.icon || t.image || t.thumbnail;
  const iconUrl = icon ? (icon.startsWith('http') ? icon : `${API_BASE}${icon}`) : '';

  return {
    id: t.id,
    name: t.name || t.title || 'Untitled Tool',
    description: t.description || t.content || '',
    category: t.category || t.type || 'General',
    icon: iconUrl,
    rating: t.rating || t.averageRating || 0,
    downloads: t.downloads || t.downloadsCount || t.usersCount || 0,
    isPremium: t.isPremium ?? t.premium ?? false,
    url: t.url || t.link || '',
  };
}

export function ToolkitList({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>('/queries/tools');
      const dataArray = Array.isArray(data) ? data : [];
      setTools(dataArray.map(mapTool));
    } catch (err) {
      console.error('Failed to load tools:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tools');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTools = activeTab === 'premium'
    ? tools.filter(t => t.isPremium)
    : tools;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2196F3]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h1 className="ml-3">Toolkit</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

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
              <h1>Toolkit</h1>
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
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#2196F3]">
                All Tools
              </TabsTrigger>
              <TabsTrigger value="premium" className="data-[state=active]:bg-white data-[state=active]:text-[#2196F3]">
                Premium
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {filteredTools.map((tool) => (
          <article
            key={tool.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={tool.icon}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="line-clamp-1">{tool.name}</h3>
                      {tool.isPremium && (
                        <Badge className="bg-[#FF9800] hover:bg-[#F57C00] text-white border-none text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[#757575] line-clamp-2 mb-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <Badge
                  variant="secondary"
                  className="bg-[#E3F2FD] text-[#2196F3] hover:bg-[#BBDEFB] mb-3"
                >
                  {tool.category}
                </Badge>

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-[#757575]">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
                      <span>{tool.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{tool.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <a
                    href={tool.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!tool.url) {
                        e.preventDefault();
                        alert('Tool URL not available');
                      }
                    }}
                    className="flex items-center gap-1 text-[#2196F3] text-sm"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mx-4 my-4 bg-gradient-to-br from-[#2196F3] to-[#1976D2] rounded-lg p-4 text-white">
        <h3 className="text-white mb-2">Need a Custom Tool?</h3>
        <p className="text-white/90 text-sm mb-3">
          Can't find what you're looking for? Request a custom tool development for your organization.
        </p>
        <button className="w-full bg-white text-[#2196F3] px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
          Request Custom Tool
        </button>
      </div>
    </div>
  );
}
