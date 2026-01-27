import { useState } from 'react';
import { ArrowLeft, Search, Filter, ExternalLink, Star, Download, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

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

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Temperature Monitoring Logger',
    description: 'Digital tool for tracking and logging temperature readings across your facility',
    category: 'Monitoring',
    icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    rating: 4.7,
    downloads: 3421,
    isPremium: false,
    url: 'https://example.com/temp-logger',
  },
  {
    id: '2',
    name: 'Allergen Cross-Contact Calculator',
    description: 'Calculate risk levels for allergen cross-contact in shared equipment',
    category: 'Allergens',
    icon: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop',
    rating: 4.9,
    downloads: 2156,
    isPremium: true,
    url: 'https://example.com/allergen-calc',
  },
  {
    id: '3',
    name: 'HACCP Plan Builder',
    description: 'Interactive tool to build comprehensive HACCP plans step-by-step',
    category: 'HACCP',
    icon: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
    rating: 4.8,
    downloads: 5234,
    isPremium: true,
    url: 'https://example.com/haccp-builder',
  },
  {
    id: '4',
    name: 'Sanitation Schedule Manager',
    description: 'Create and manage cleaning schedules with automated reminders',
    category: 'Sanitation',
    icon: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop',
    rating: 4.6,
    downloads: 1897,
    isPremium: false,
    url: 'https://example.com/sanitation',
  },
  {
    id: '5',
    name: 'Shelf Life Calculator',
    description: 'Calculate product shelf life based on storage conditions and ingredients',
    category: 'Quality',
    icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    rating: 4.5,
    downloads: 2678,
    isPremium: false,
    url: 'https://example.com/shelf-life',
  },
  {
    id: '6',
    name: 'Supplier Audit Checklist',
    description: 'Comprehensive digital checklist for conducting supplier audits',
    category: 'Compliance',
    icon: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=400&fit=crop',
    rating: 4.7,
    downloads: 1543,
    isPremium: true,
    url: 'https://example.com/audit-checklist',
  },
];

export function ToolkitList({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTools = activeTab === 'premium'
    ? mockTools.filter(t => t.isPremium)
    : mockTools;

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
                  <button className="flex items-center gap-1 text-[#2196F3] text-sm">
                    <span>Open</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
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
