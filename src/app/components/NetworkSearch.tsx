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

// Organization type filter tabs
const categories = [
  { id: 'all', label: 'All', icon: null },
  { id: 'manufacturer', label: 'Manufacturers', icon: <Building2 className="w-4 h-4" /> },
  { id: 'laboratory', label: 'Labs', icon: <Beaker className="w-4 h-4" /> },
  { id: 'consultant', label: 'Consultants', icon: <Users className="w-4 h-4" /> },
  { id: 'training', label: 'Training', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'service', label: 'Services', icon: <Wrench className="w-4 h-4" /> },
];

interface NetworkDataItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  avatar: string;
  itemType: 'user' | 'organization';
  category: string;
}

interface NetworkSearchProps {
  networkData: NetworkDataItem[];
  onBack: () => void;
  onSelect: (id: string, type: string) => void;
}

export function NetworkSearch({ networkData, onBack, onSelect }: NetworkSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Convert network data to search results format - only organizations
  const allResults: SearchResult[] = networkData
    .filter(item => item.itemType === 'organization')
    .map(item => ({
      id: item.id,
      name: item.name,
      type: 'organization' as const,
      category: item.category || '',
      location: item.location || '',
      thumbnail: item.avatar || '',
      description: '',
      verified: false,
    }));

  // Filter results based on search query and category
  const query = searchQuery.toLowerCase();
  const filteredResults = allResults.filter((result) => {
    // Filter by search query
    const matchesQuery = !searchQuery.trim() ||
      (result.name || '').toLowerCase().includes(query) ||
      (result.category || '').toLowerCase().includes(query) ||
      (result.location || '').toLowerCase().includes(query) ||
      (result.description || '').toLowerCase().includes(query);

    // Filter by organization type/category
    const matchesCategory = selectedCategory === 'all' ||
      (result.category || '').toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesQuery && matchesCategory;
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
                placeholder="Search organizations..."
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
                  result.type === 'organization' ? 'w-16 h-16 rounded-lg' : 'w-14 h-14 rounded-full'
                } overflow-hidden ${result.type === 'organization' ? 'bg-[#1976D2]' : 'bg-[#2E7D32]'} flex-shrink-0`}>
                  {result.thumbnail ? (
                    <img
                      src={result.thumbnail}
                      alt={result.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      {result.type === 'organization' ? (
                        <Building2 className="w-6 h-6" />
                      ) : (
                        <span className="text-lg font-semibold">
                          {result.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="line-clamp-1 mb-0.5">{result.name}</h4>
                  <p className="text-sm text-[#757575] line-clamp-1 mb-1">{result.category}</p>
                  {result.description && (
                    <p className="text-xs text-[#757575] line-clamp-1 mb-1">{result.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    {result.location && (
                      <div className="flex items-center gap-1 text-xs text-[#757575]">
                        <MapPin className="w-3 h-3" />
                        <span>{result.location}</span>
                      </div>
                    )}
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
