import { ArrowLeft, Search, MapPin, Building2, Beaker, GraduationCap, Users, Wrench } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface SearchResult {
  id: string;
  name: string;
  type: 'organization' | 'person';
  category: string;
  location: string;
  thumbnail: string;
  description?: string;
  verified?: boolean;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    name: 'FreshPro Organic Foods',
    type: 'organization',
    category: 'Food Manufacturer',
    location: 'Portland, OR',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    description: 'Leading organic food manufacturer',
    verified: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    type: 'person',
    category: 'Food Safety Manager',
    location: 'Portland, OR',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    description: 'FreshPro Organic Foods',
  },
  {
    id: '3',
    name: 'SafetyFirst Lab Services',
    type: 'organization',
    category: 'Testing Laboratory',
    location: 'Portland, OR',
    thumbnail: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400&h=300&fit=crop',
    verified: true,
  },
];

const categories = [
  { id: 'all', label: 'All', icon: null },
  { id: 'manufacturer', label: 'Manufacturers', icon: <Building2 className="w-4 h-4" /> },
  { id: 'laboratory', label: 'Labs', icon: <Beaker className="w-4 h-4" /> },
  { id: 'consultant', label: 'Consultants', icon: <Users className="w-4 h-4" /> },
  { id: 'training', label: 'Training', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
];

export function NetworkSearch({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string, type: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           result.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search organizations and people..."
                className="w-full h-11 pl-10 pr-4 bg-[#F5F5F5] rounded-lg text-sm text-[#212121] placeholder:text-[#757575] outline-none focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                autoFocus
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white text-[#757575] border border-gray-200'
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="px-4 py-4">
        {searchQuery && (
          <p className="text-sm text-[#757575] mb-3">
            {filteredResults.length} results for "{searchQuery}"
          </p>
        )}

        <div className="space-y-3">
          {filteredResults.map((result) => (
            <article
              key={result.id}
              onClick={() => onSelect(result.id, result.type)}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`${
                  result.type === 'organization' ? 'w-16 h-16' : 'w-14 h-14'
                } rounded-${result.type === 'person' ? 'full' : 'lg'} overflow-hidden bg-gray-100 flex-shrink-0`}>
                  <img
                    src={result.thumbnail}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="line-clamp-1 mb-0.5">{result.name}</h4>
                  <p className="text-sm text-[#757575] line-clamp-1 mb-1">{result.category}</p>
                  {result.description && (
                    <p className="text-xs text-[#757575] line-clamp-1 mb-1">{result.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-[#757575]">
                      <MapPin className="w-3 h-3" />
                      <span>{result.location}</span>
                    </div>
                    {result.verified && (
                      <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] border-none text-xs px-1.5 py-0">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredResults.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-[#757575] mx-auto mb-3" />
            <h3 className="mb-2">No results found</h3>
            <p className="text-sm text-[#757575] max-w-xs mx-auto">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
