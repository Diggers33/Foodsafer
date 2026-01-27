import { ArrowLeft, Download, Share2, Bookmark, Clock, Users, Star, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { api } from '@/api';

interface FrameworkData {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  users: number;
  rating: number;
  lastUpdated: string;
  author: {
    name: string;
    organization: string;
    avatar: string;
  };
  sections: Array<{
    id: string;
    title: string;
    duration: string;
  }>;
  relatedFrameworks: Array<{
    id: string;
    title: string;
    thumbnail: string;
  }>;
}

const API_BASE = 'https://test.foodsafer.com/api';

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

function formatDuration(minutes: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min read`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h read`;
}

function mapFramework(f: any): FrameworkData {
  const thumbnail = f.thumbnail || f.image || f.cover;
  const thumbUrl = thumbnail ? (thumbnail.startsWith('http') ? thumbnail : `${API_BASE}${thumbnail}`) : '';

  const creator = f.creator || f.author || {};
  const authorName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || creator.name || 'Unknown';
  const authorOrg = creator.organization || creator.company || '';
  const authorAvatar = creator.avatar ? (creator.avatar.startsWith('http') ? creator.avatar : `${API_BASE}${creator.avatar}`) : '';

  const sections = (f.sections || f.chapters || []).map((s: any, idx: number) => ({
    id: s.id || String(idx + 1),
    title: s.title || s.name || `Section ${idx + 1}`,
    duration: s.duration ? `${s.duration} min` : '',
  }));

  const relatedFrameworks = (f.relatedFrameworks || f.related || []).map((r: any) => {
    const relThumb = r.thumbnail || r.image || r.cover;
    return {
      id: r.id,
      title: r.title || r.name || 'Related Framework',
      thumbnail: relThumb ? (relThumb.startsWith('http') ? relThumb : `${API_BASE}${relThumb}`) : '',
    };
  });

  return {
    id: f.id,
    title: f.title || f.name || 'Untitled Framework',
    description: f.description || f.content || '',
    category: f.category || f.type || 'General',
    thumbnail: thumbUrl,
    duration: formatDuration(f.duration || f.readTime || 0),
    users: f.usersCount || f.users || f.viewsCount || 0,
    rating: f.rating || f.averageRating || 0,
    lastUpdated: formatDate(f.updatedAt || f.createdAt || ''),
    author: { name: authorName, organization: authorOrg, avatar: authorAvatar },
    sections,
    relatedFrameworks,
  };
}

export function FrameworkDetail({ frameworkId, onBack }: { frameworkId: string; onBack: () => void }) {
  const [isSaved, setIsSaved] = useState(false);
  const [framework, setFramework] = useState<FrameworkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFramework();
  }, [frameworkId]);

  const fetchFramework = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/queries/frameworks/${frameworkId}`);
      setFramework(mapFramework(data));
    } catch (err) {
      console.error('Failed to load framework:', err);
      setError(err instanceof Error ? err.message : 'Failed to load framework');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (error || !framework) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h2 className="ml-3">Framework</h2>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'Framework not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </button>
          <div className="flex items-center gap-3">
            <button>
              <Share2 className="w-6 h-6 text-[#757575]" />
            </button>
            <button onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-[#2E7D32] text-[#2E7D32]' : 'text-[#757575]'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={framework.thumbnail}
          alt={framework.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Category Badge */}
        <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] border-none mb-3">
          {framework.category}
        </Badge>

        {/* Title */}
        <h1 className="mb-3">{framework.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-[#757575] mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{framework.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{framework.users.toLocaleString()} users</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
            <span>{framework.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Updated {framework.lastUpdated}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="mb-2">About this Framework</h3>
          <p className="text-[#212121] leading-relaxed">
            {framework.description}
          </p>
        </div>

        {/* Author */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="mb-3">Created by</h4>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img
                src={framework.author.avatar}
                alt={framework.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4>{framework.author.name}</h4>
              <p className="text-sm text-[#757575]">{framework.author.organization}</p>
            </div>
            <Button
              variant="outline"
              className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"
            >
              Follow
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="mb-3">Content Sections</h3>
          <div className="space-y-2">
            {framework.sections.map((section, index) => (
              <button
                key={section.id}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm">{section.title}</h4>
                    <p className="text-xs text-[#757575]">{section.duration}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#757575]" />
              </button>
            ))}
          </div>
        </div>

        {/* Related Frameworks */}
        <div className="mb-4">
          <h3 className="mb-3">Related Frameworks</h3>
          <div className="grid grid-cols-2 gap-3">
            {framework.relatedFrameworks.map((related) => (
              <div
                key={related.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="h-24 bg-gray-100">
                  <img
                    src={related.thumbnail}
                    alt={related.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm line-clamp-2">{related.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200">
          <Button className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
            <Download className="w-5 h-5 mr-2" />
            Download Framework
          </Button>
        </div>
      </div>
    </div>
  );
}
