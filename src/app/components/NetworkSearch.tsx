import { ArrowLeft, Search, MapPin, Building2, Beaker, GraduationCap, Users, Wrench, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { api } from '@/api';

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

const API_BASE = 'https://my.foodsafer.com:443/api';

function mapCompanyToResult(c: any): SearchResult {
  const logo = c.logo ? (c.logo.startsWith('http') ? c.logo : `${API_BASE}${c.logo}`) : '';
  const address = c.address || c.city || c.country || '';

  return {
    id: c.id,
    name: c.name || 'Unknown',
    type: 'organization',
    category: c.type || c.category || 'Organization',
    location: address,
    thumbnail: logo,
    description: c.description || '',
    verified: c.verified || c.isVerified || false,
  };
}

function mapUserToResult(u: any): SearchResult {
  const avatar = u.avatar ? (u.avatar.startsWith('http') ? u.avatar : `${API_BASE}${u.avatar}`) : '';
  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown';
  const company = u.userCompanies?.[0]?.company?.name || '';

  return {
    id: u.id,
    name,
    type: 'person',
    category: u.jobTitle || u.role || 'Member',
    location: u.city || u.country || '',
    thumbnail: avatar,
    description: company,
    verified: false,
  };
}

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialCompanies, setInitialCompanies] = useState<SearchResult[]>([]);

  // Load initial data from network endpoint (users and organizations)
  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const allResults: SearchResult[] = [];

      // Fetch organizations (mode=2)
      try {
        const orgsData = await api.get<any[]>('/queries/network?filterBy=&mode=2&relations=true');
        const orgs = Array.isArray(orgsData) ? orgsData.map(mapCompanyToResult) : [];
        allResults.push(...orgs);
      } catch (e) {
        console.log('Failed to fetch organizations:', e);
      }

      // Fetch users (mode=1)
      try {
        const usersData = await api.get<any[]>('/queries/network?filterBy=&mode=1&relations=true');
        const users = Array.isArray(usersData) ? usersData.map(mapUserToResult) : [];
        allResults.push(...users);
      } catch (e) {
        console.log('Failed to fetch users:', e);
      }

      setInitialCompanies(allResults);
      setResults(allResults);
    } catch (err) {
      console.error('Failed to load network data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter locally when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults(initialCompanies);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = initialCompanies.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query))
    );
    setResults(filtered);
  }, [searchQuery, initialCompanies]);

  const filteredResults = results.filter((result) => {
    const matchesCategory = selectedCategory === 'all' ||
                           result.category.toLowerCase().includes(selectedCategory);
    return matchesCategory;
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
          </div>
        ) : error && results.length === 0 ? (
          <p className="text-red-600 text-sm text-center py-8">{error}</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
