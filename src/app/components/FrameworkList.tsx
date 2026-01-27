import { useState } from 'react';
import { ArrowLeft, Search, Filter, Download, BookOpen, Clock, Users, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { FrameworkDetail } from './FrameworkDetail';

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

const mockFrameworks: Framework[] = [
  {
    id: '1',
    title: 'HACCP Implementation Guide 2026',
    description: 'Comprehensive guide for implementing Hazard Analysis and Critical Control Points in food facilities',
    category: 'HACCP',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    duration: '45 min read',
    users: 1247,
    rating: 4.8,
    lastUpdated: '2026-01-10',
    featured: true,
  },
  {
    id: '2',
    title: 'Allergen Control Framework',
    description: 'Step-by-step framework for managing allergens and preventing cross-contamination',
    category: 'Allergens',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    duration: '30 min read',
    users: 892,
    rating: 4.9,
    lastUpdated: '2026-01-08',
    featured: true,
  },
  {
    id: '3',
    title: 'Food Traceability System Design',
    description: 'Framework for implementing end-to-end traceability in food supply chains',
    category: 'Traceability',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
    duration: '60 min read',
    users: 634,
    rating: 4.7,
    lastUpdated: '2026-01-05',
    featured: false,
  },
  {
    id: '4',
    title: 'Quality Management Standards',
    description: 'ISO 22000 and FSSC 22000 implementation framework for food safety management',
    category: 'Quality',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop',
    duration: '50 min read',
    users: 1089,
    rating: 4.8,
    lastUpdated: '2026-01-03',
    featured: false,
  },
  {
    id: '5',
    title: 'Sanitation & Hygiene Protocols',
    description: 'Best practices framework for maintaining sanitation standards in food facilities',
    category: 'Sanitation',
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    duration: '35 min read',
    users: 756,
    rating: 4.6,
    lastUpdated: '2025-12-28',
    featured: false,
  },
];

export function FrameworkList({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  if (selectedFramework) {
    return (
      <FrameworkDetail
        frameworkId={selectedFramework}
        onBack={() => setSelectedFramework(null)}
      />
    );
  }

  const filteredFrameworks = activeTab === 'featured'
    ? mockFrameworks.filter(f => f.featured)
    : mockFrameworks;

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
