import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Download, BookOpen, Clock, Users, Star, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { FrameworkDetail } from './FrameworkDetail';
import { api } from '@/api';

interface Framework {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  users: number;
  rating: number;
  lastUpdated: string;
  featured: boolean;
}

const API_BASE = 'https://test.foodsafer.com/api';

function formatDuration(minutes: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min read`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h read`;
}

function mapFramework(f: any): Framework {
  const thumbnail = f.thumbnail || f.image || f.cover;
  const thumbUrl = thumbnail ? (thumbnail.startsWith('http') ? thumbnail : `${API_BASE}${thumbnail}`) : '';

  return {
    id: f.id,
    title: f.title || f.name || 'Untitled Framework',
    description: f.description || f.content || '',
    category: f.category || f.type || 'General',
    thumbnail: thumbUrl,
    duration: formatDuration(f.duration || f.readTime || 0),
    users: f.usersCount || f.users || f.viewsCount || 0,
    rating: f.rating || f.averageRating || 0,
    lastUpdated: f.updatedAt || f.createdAt || '',
    featured: f.featured ?? f.isFeatured ?? false,
  };
}

export function FrameworkList({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>('/queries/frameworks');
      const dataArray = Array.isArray(data) ? data : [];
      setFrameworks(dataArray.map(mapFramework));
    } catch (err) {
      console.error('Failed to load frameworks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load frameworks');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedFramework) {
    return (
      <FrameworkDetail
        frameworkId={selectedFramework}
        onBack={() => setSelectedFramework(null)}
      />
    );
  }

  const filteredFrameworks = activeTab === 'featured'
    ? frameworks.filter(f => f.featured)
    : frameworks;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
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
            <h1 className="ml-3">Framework</h1>
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
              <h1>Framework</h1>
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
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
                All Frameworks
              </TabsTrigger>
              <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
                Featured
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {filteredFrameworks.map((framework) => (
          <article
            key={framework.id}
            onClick={() => setSelectedFramework(framework.id)}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative h-40 bg-gray-100">
              <img
                src={framework.thumbnail}
                alt={framework.title}
                className="w-full h-full object-cover"
              />
              {framework.featured && (
                <Badge className="absolute top-3 right-3 bg-[#FF9800] hover:bg-[#F57C00] text-white border-none">
                  Featured
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="flex-1 line-clamp-2">{framework.title}</h3>
                <button className="flex-shrink-0">
                  <Download className="w-5 h-5 text-[#757575]" />
                </button>
              </div>

              <p className="text-sm text-[#757575] line-clamp-2 mb-3">
                {framework.description}
              </p>

              {/* Category Badge */}
              <Badge
                variant="secondary"
                className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] mb-3"
              >
                {framework.category}
              </Badge>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-[#757575]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{framework.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{framework.users.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
                  <span>{framework.rating}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
