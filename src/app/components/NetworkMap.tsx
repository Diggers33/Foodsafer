import { useState, useEffect } from 'react';
import { Search, Filter, List, MapPin, Navigation, MessageSquare, Users as UsersIcon, Loader2 } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { OrganizationDetail } from './OrganizationDetail';
import { MessagesList } from './MessagesList';
import { ConnectionsList } from './ConnectionsList';
import { NetworkSearch } from './NetworkSearch';
import { GoogleMapView } from './GoogleMapView';
import { UserProfileDetail } from './UserProfileDetail';
import { api } from '@/api';

interface NetworkPerson {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  avatar: string;
  lat: number;
  lng: number;
  isConnected: boolean;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function parseCoordinate(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

function mapUser(u: any, isConnected: boolean = false): NetworkPerson {
  const avatar = u.avatar ? (u.avatar.startsWith('http') ? u.avatar : `${API_BASE}${u.avatar}`) : '';
  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Unknown';
  const company = u.userCompanies?.[0]?.company?.name || u.organization || u.company || '';
  const location = u.city || u.country || u.location || '';

  // Parse coordinates - users may have lat/lng from their profile or company
  const lat = parseCoordinate(u.latitude) ?? parseCoordinate(u.lat) ??
              parseCoordinate(u.userCompanies?.[0]?.company?.latitude);
  const lng = parseCoordinate(u.longitude) ?? parseCoordinate(u.lng) ??
              parseCoordinate(u.userCompanies?.[0]?.company?.longitude);

  return {
    id: u.id,
    name,
    role: u.jobTitle || u.role || u.title || '',
    organization: company,
    location,
    avatar,
    lat: lat ?? NaN,
    lng: lng ?? NaN,
    isConnected,
  };
}

export function NetworkMap({ onProfileClick }: { onProfileClick: () => void }) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [people, setPeople] = useState<NetworkPerson[]>([]);
  const [visiblePeopleIds, setVisiblePeopleIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allPeople: NetworkPerson[] = [];
      const seenIds = new Set<string>();

      // Fetch from the network endpoint that returns both users and companies
      const response = await api.get<any>('/queries/network?filterBy=&mode=2&relations=true');
      const items = Array.isArray(response) ? response : [];
      console.log('Network items found:', items.length);

      items.forEach((item: any) => {
        if (seenIds.has(item.id)) return;
        seenIds.add(item.id);

        // Check if it's a user (type: 1) or company (type: 2)
        if (item.type === 1 || item.firstName) {
          // It's a user
          allPeople.push(mapUser(item, false));
        } else {
          // It's a company/organization
          const logo = item.logo || item.image || item.thumbnail || item.avatar || '';
          const logoUrl = logo ? (logo.startsWith('http') ? logo : `${API_BASE}${logo}`) : '';
          const lat = parseCoordinate(item.latitude) ?? parseCoordinate(item.lat);
          const lng = parseCoordinate(item.longitude) ?? parseCoordinate(item.lng);

          allPeople.push({
            id: item.id,
            name: item.name || 'Unknown Organization',
            role: 'Organization',
            organization: '',
            location: item.address || item.city || item.country || '',
            avatar: logoUrl,
            lat: lat ?? NaN,
            lng: lng ?? NaN,
            isConnected: false,
          });
        }
      });

      const withCoords = allPeople.filter(p => isFinite(p.lat) && isFinite(p.lng));
      console.log(`Network: ${allPeople.length} total, ${withCoords.length} with valid coordinates`);
      if (withCoords.length > 0) {
        console.log('Sample coordinates:', withCoords.slice(0, 3).map(p => ({ name: p.name, lat: p.lat, lng: p.lng })));
      }
      setPeople(allPeople);
    } catch (err) {
      console.error('Failed to load network:', err);
      setError(err instanceof Error ? err.message : 'Failed to load network');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedUser) {
    return <UserProfileDetail userId={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

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
          } else if (type === 'user') {
            setSelectedUser(id);
          }
        }}
      />
    );
  }

  // Convert people to Google Maps location format - only include items with valid coordinates
  const mapLocations = people
    .filter(p => isFinite(p.lat) && isFinite(p.lng))
    .map(person => ({
      id: person.id,
      name: person.name,
      category: person.organization || person.role,
      position: { lat: person.lat, lng: person.lng },
      thumbnail: person.avatar,
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
              setSelectedUser(id);
            }}
            onBoundsChange={(visibleIds) => {
              setVisiblePeopleIds(visibleIds);
            }}
          />

          {/* Bottom Sheet */}
          <div className="bg-white rounded-t-2xl shadow-lg -mt-6 relative z-10">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3"></div>
            <div className="px-4 pb-4">
              {(() => {
                // Filter to show only people visible in current map view
                // If no bounds calculated yet, show all people with valid coords
                const peopleWithCoords = people.filter(p => isFinite(p.lat) && isFinite(p.lng));
                const visiblePeople = visiblePeopleIds.length > 0
                  ? peopleWithCoords.filter(p => visiblePeopleIds.includes(p.id))
                  : peopleWithCoords;
                const itemCount = visiblePeople.length;

                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3>{itemCount} {itemCount === 1 ? 'person' : 'people'} in this area</h3>
                    </div>
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
                      </div>
                    ) : error ? (
                      <p className="text-red-600 text-sm text-center py-4">{error}</p>
                    ) : itemCount === 0 ? (
                      <p className="text-[#757575] text-center py-4">No people in this area. Try zooming out.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {visiblePeople.map((person) => (
                          <NetworkPersonCard key={person.id} person={person} compact onSelect={() => setSelectedUser(person.id)} />
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
          ) : people.length === 0 ? (
            <p className="text-[#757575] text-center py-8">No people found in network</p>
          ) : (
            <>
              <div className="mb-3 text-sm text-[#757575]">
                {people.length} people in network
              </div>
              <div className="space-y-3">
                {people.map((person) => (
                  <NetworkPersonCard key={person.id} person={person} onSelect={() => setSelectedUser(person.id)} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NetworkPersonCard({ person, compact = false, onSelect }: { person: NetworkPerson; compact?: boolean; onSelect: () => void }) {
  return (
    <article onClick={onSelect} className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-3 p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-full overflow-hidden flex-shrink-0 bg-gray-100`}>
        {person.avatar ? (
          <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-lg font-semibold">
            {person.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="line-clamp-1">{person.name}</h4>
          {person.isConnected && (
            <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full">Connected</span>
          )}
        </div>
        {person.role && <p className="text-sm text-[#757575] line-clamp-1">{person.role}</p>}
        {person.organization && <p className="text-xs text-[#757575] line-clamp-1">{person.organization}</p>}
        {person.location && (
          <div className="flex items-center gap-1 text-xs text-[#757575] mt-1">
            <MapPin className="w-3 h-3" />
            <span>{person.location}</span>
          </div>
        )}
      </div>
    </article>
  );
}