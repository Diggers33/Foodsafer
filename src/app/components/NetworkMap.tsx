import { useState, useEffect } from 'react';
import { Search, Filter, List, MapPin, Navigation, MessageSquare, Users as UsersIcon, Loader2 } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { OrganizationDetail } from './OrganizationDetail';
import { MessagesList } from './MessagesList';
import { ConnectionsList } from './ConnectionsList';
import { NetworkSearch } from './NetworkSearch';
import { GoogleMapView } from './GoogleMapView';
import { api } from '@/api';

interface NetworkItem {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  thumbnail: string;
  lat: number;
  lng: number;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function parseCoordinate(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

function mapCompany(c: any): NetworkItem {
  // Try multiple fields for the logo/image
  const logoField = c.logo || c.image || c.thumbnail || c.avatar || c.picture ||
                    c.file?.url || c.file?.rawLink || '';
  const logo = logoField ? (logoField.startsWith('http') ? logoField : `${API_BASE}${logoField}`) : '';

  const address = c.address || c.city || c.country || c.location || '';

  // Parse coordinates safely - allow 0 as valid value
  const lat = parseCoordinate(c.latitude) ?? parseCoordinate(c.lat);
  const lng = parseCoordinate(c.longitude) ?? parseCoordinate(c.lng);

  return {
    id: c.id,
    name: c.name || 'Unknown Company',
    category: c.type || c.category || 'Organization',
    location: address,
    distance: '',
    thumbnail: logo,
    lat: lat ?? NaN,
    lng: lng ?? NaN,
  };
}

export function NetworkMap({ onProfileClick }: { onProfileClick: () => void }) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [companies, setCompanies] = useState<NetworkItem[]>([]);
  const [visibleCompanyIds, setVisibleCompanyIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>('/queries/companies');
      const companiesArray = Array.isArray(data) ? data : [];
      const mapped = companiesArray.map(mapCompany);
      const withCoords = mapped.filter(c => isFinite(c.lat) && isFinite(c.lng));
      console.log(`Companies: ${mapped.length} total, ${withCoords.length} with valid coordinates`);
      if (withCoords.length > 0) {
        console.log('Sample coordinates:', withCoords.slice(0, 3).map(c => ({ name: c.name, lat: c.lat, lng: c.lng })));
      }
      setCompanies(mapped);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedOrg) {
    return <OrganizationDetail orgId={selectedOrg} onBack={() => setSelectedOrg(null)} />;
  }

  if (showMessages) {
    return <MessagesList onBack={() => setShowMessages(false)} />;
  }

  if (showConnections) {
    return <ConnectionsList onBack={() => setShowConnections(false)} />;
  }

  if (showSearch) {
    return (
      <NetworkSearch
        onBack={() => setShowSearch(false)}
        onSelect={(id, type) => {
          setShowSearch(false);
          if (type === 'organization') {
            setSelectedOrg(id);
          }
        }}
      />
    );
  }

  // Convert companies to Google Maps location format - only include items with valid coordinates
  const mapLocations = companies
    .filter(c => isFinite(c.lat) && isFinite(c.lng))
    .map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      position: { lat: item.lat, lng: item.lng },
      thumbnail: item.thumbnail,
    }));

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <AppHeader onProfileClick={onProfileClick} />
      
      {/* Subheader with controls */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1>Network</h1>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowMessages(true)}>
                <MessageSquare className="w-6 h-6 text-[#757575]" />
              </button>
              <button onClick={() => setShowConnections(true)}>
                <UsersIcon className="w-6 h-6 text-[#757575]" />
              </button>
              <button onClick={() => setShowSearch(true)}>
                <Search className="w-6 h-6 text-[#757575]" />
              </button>
              <button>
                <Filter className="w-6 h-6 text-[#757575]" />
              </button>
              <button
                onClick={() => setView(view === 'map' ? 'list' : 'map')}
                className={view === 'list' ? 'text-[#2E7D32]' : 'text-[#757575]'}
              >
                <List className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      {view === 'map' && (
        <div className="relative">
          {/* Google Map */}
          <GoogleMapView
            locations={mapLocations}
            onMarkerClick={(id) => {
              setSelectedOrg(id);
            }}
            onBoundsChange={(visibleIds) => {
              setVisibleCompanyIds(visibleIds);
            }}
          />

          {/* Bottom Sheet */}
          <div className="bg-white rounded-t-2xl shadow-lg -mt-6 relative z-10">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3"></div>
            <div className="px-4 pb-4">
              {(() => {
                // Filter to show only companies visible in current map view
                // If no bounds calculated yet, show all companies with valid coords
                const companiesWithCoords = companies.filter(c => isFinite(c.lat) && isFinite(c.lng));
                const visibleCompanies = visibleCompanyIds.length > 0
                  ? companiesWithCoords.filter(c => visibleCompanyIds.includes(c.id))
                  : companiesWithCoords;
                const itemCount = visibleCompanies.length;

                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3>{itemCount} {itemCount === 1 ? 'item' : 'items'} in this area</h3>
                    </div>
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
                      </div>
                    ) : error ? (
                      <p className="text-red-600 text-sm text-center py-4">{error}</p>
                    ) : itemCount === 0 ? (
                      <p className="text-[#757575] text-center py-4">No organizations in this area. Try zooming out.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {visibleCompanies.map((item) => (
                          <NetworkItemCard key={item.id} item={item} compact onSelect={() => setSelectedOrg(item.id)} />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="px-4 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
            </div>
          ) : error ? (
            <p className="text-red-600 text-sm text-center py-8">{error}</p>
          ) : companies.length === 0 ? (
            <p className="text-[#757575] text-center py-8">No organizations found</p>
          ) : (
            <>
              <div className="mb-3 text-sm text-[#757575]">
                {companies.length} organizations
              </div>
              <div className="space-y-3">
                {companies.map((item) => (
                  <NetworkItemCard key={item.id} item={item} onSelect={() => setSelectedOrg(item.id)} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NetworkItemCard({ item, compact = false, onSelect }: { item: NetworkItem; compact?: boolean; onSelect: () => void }) {
  return (
    <article onClick={onSelect} className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-3 p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} rounded-lg overflow-hidden flex-shrink-0 bg-gray-100`}>
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-lg font-semibold">
            {item.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="line-clamp-1 mb-1">{item.name}</h4>
        <p className="text-sm text-[#757575] mb-1">{item.category}</p>
        <div className="flex items-center gap-3 text-xs text-[#757575]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{item.location}</span>
          </div>
          <span>•</span>
          <span>{item.distance}</span>
        </div>
      </div>
    </article>
  );
}