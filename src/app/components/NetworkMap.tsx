import { useState, useEffect } from 'react';
import { Search, Filter, List, MapPin, Navigation, MessageSquare, Users as UsersIcon, Building2, Loader2 } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { OrganizationDetail } from './OrganizationDetail';
import { MessagesList } from './MessagesList';
import { ConnectionsList } from './ConnectionsList';
import { NetworkSearch } from './NetworkSearch';
import { GoogleMapView } from './GoogleMapView';
import { UserProfileDetail, UserProfileData } from './UserProfileDetail';
import { api } from '@/api';

type NetworkItemType = 'user' | 'organization';
type FilterType = 'all' | 'users' | 'organizations';

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
  itemType: NetworkItemType;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function parseCoordinate(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

function mapUser(u: any, isConnected: boolean = false, companyCoord?: { lat: number; lng: number } | null): NetworkPerson {
  const avatar = u.avatar ? (u.avatar.startsWith('http') ? u.avatar : `${API_BASE}${u.avatar}`) : '';
  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Unknown';
  const company = u.userCompanies?.[0]?.company?.name || u.organization || u.company || '';
  const location = u.city || u.country || u.location || '';

  // Parse coordinates - users may have lat/lng from their profile or company
  let lat = parseCoordinate(u.latitude) ?? parseCoordinate(u.lat) ??
            parseCoordinate(u.userCompanies?.[0]?.company?.latitude);
  let lng = parseCoordinate(u.longitude) ?? parseCoordinate(u.lng) ??
            parseCoordinate(u.userCompanies?.[0]?.company?.longitude);

  // Use company coordinates from lookup if user doesn't have their own
  if ((lat === null || lng === null) && companyCoord) {
    lat = companyCoord.lat;
    lng = companyCoord.lng;
  }

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
    itemType: 'user',
  };
}

export function NetworkMap({ onProfileClick }: { onProfileClick: () => void }) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [people, setPeople] = useState<NetworkPerson[]>([]);
  const [visiblePeopleIds, setVisiblePeopleIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [mapZoom, setMapZoom] = useState<number | null>(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allPeople: NetworkPerson[] = [];
      const seenIds = new Set<string>();

      // Fetch organizations (mode=2) and users (mode=1) separately
      let items: any[] = [];

      // Fetch organizations
      try {
        const orgsResponse = await api.get<any>('/queries/network?filterBy=&mode=2&relations=true');
        const orgs = Array.isArray(orgsResponse) ? orgsResponse : [];
        console.log('Organizations found:', orgs.length);
        items.push(...orgs);
      } catch (e) {
        console.log('Failed to fetch organizations:', e);
      }

      // Fetch users
      try {
        const usersResponse = await api.get<any>('/queries/network?filterBy=&mode=1&relations=true');
        const users = Array.isArray(usersResponse) ? usersResponse : [];
        console.log('Users found:', users.length);
        items.push(...users);
      } catch (e) {
        console.log('Failed to fetch users:', e);
      }

      console.log('Network items total:', items.length);

      // First pass: collect all companies with coordinates for user lookup
      const companyCoords = new Map<string, { lat: number; lng: number }>();
      items.forEach((item: any) => {
        if (item.type !== 1 && !item.firstName) {
          const lat = parseCoordinate(item.latitude) ?? parseCoordinate(item.lat);
          const lng = parseCoordinate(item.longitude) ?? parseCoordinate(item.lng);
          if (lat !== null && lng !== null) {
            companyCoords.set(item.id, { lat, lng });
          }
        }
      });

      items.forEach((item: any) => {
        if (seenIds.has(item.id)) return;
        seenIds.add(item.id);

        // Check if it's a user (type: 1) or company (type: 2)
        if (item.type === 1 || item.firstName) {
          // It's a user - try to get coordinates from their company
          const userCompanyId = item.userCompanies?.[0]?.company?.id || item.userCompanies?.[0]?.companyId;
          const companyCoord = userCompanyId ? companyCoords.get(userCompanyId) : null;
          allPeople.push(mapUser(item, false, companyCoord));
        } else {
          // It's a company/organization - only use logo field, not image (which is the cover/display image)
          const logo = item.logo || '';
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
            itemType: 'organization',
          });
        }
      });

      const withCoords = allPeople.filter(p => isFinite(p.lat) && isFinite(p.lng));
      const usersWithCoords = allPeople.filter(p => p.itemType === 'user' && isFinite(p.lat) && isFinite(p.lng));
      const orgsWithCoords = allPeople.filter(p => p.itemType === 'organization' && isFinite(p.lat) && isFinite(p.lng));
      const totalUsers = allPeople.filter(p => p.itemType === 'user').length;
      const totalOrgs = allPeople.filter(p => p.itemType === 'organization').length;

      console.log(`Network: ${allPeople.length} total (${totalUsers} users, ${totalOrgs} orgs)`);
      console.log(`With coordinates: ${withCoords.length} total (${usersWithCoords.length} users, ${orgsWithCoords.length} orgs)`);
      if (usersWithCoords.length > 0) {
        console.log('Sample users with coords:', usersWithCoords.slice(0, 3).map(p => ({ name: p.name, org: p.organization, lat: p.lat, lng: p.lng })));
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
    return <UserProfileDetail user={selectedUser} onBack={() => setSelectedUser(null)} />;
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
            const person = people.find(p => p.id === id);
            if (person) {
              setSelectedUser({
                id: person.id,
                name: person.name,
                avatar: person.avatar,
                role: person.role,
                organization: person.organization,
                location: person.location,
                isConnected: person.isConnected,
              });
            }
          }
        }}
      />
    );
  }

  // Filter people based on selected filter type
  const filteredPeople = people.filter(p => {
    if (filterType === 'all') return true;
    if (filterType === 'users') return p.itemType === 'user';
    if (filterType === 'organizations') return p.itemType === 'organization';
    return true;
  });

  // Convert filtered people to Google Maps location format - only include items with valid coordinates
  const mapLocations = filteredPeople
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
          <div className="flex items-center justify-between mb-3">
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
              <button
                onClick={() => setView(view === 'map' ? 'list' : 'map')}
                className={view === 'list' ? 'text-[#2E7D32]' : 'text-[#757575]'}
              >
                <List className="w-6 h-6" />
              </button>
            </div>
          </div>
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#F5F5F5] text-[#757575] hover:bg-[#E8F5E9]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('users')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                filterType === 'users'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#F5F5F5] text-[#757575] hover:bg-[#E8F5E9]'
              }`}
            >
              <UsersIcon className="w-4 h-4" />
              Users
            </button>
            <button
              onClick={() => setFilterType('organizations')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                filterType === 'organizations'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#F5F5F5] text-[#757575] hover:bg-[#E8F5E9]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Organizations
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {view === 'map' && (
        <div className="relative">
          {/* Google Map */}
          <GoogleMapView
            locations={mapLocations}
            savedCenter={mapCenter}
            savedZoom={mapZoom}
            onMapMove={(center, zoom) => {
              setMapCenter(center);
              setMapZoom(zoom);
            }}
            onMarkerClick={(id) => {
              const item = filteredPeople.find(p => p.id === id);
              if (item?.itemType === 'organization') {
                setSelectedOrg(id);
              } else if (item) {
                setSelectedUser({
                  id: item.id,
                  name: item.name,
                  avatar: item.avatar,
                  role: item.role,
                  organization: item.organization,
                  location: item.location,
                  isConnected: item.isConnected,
                });
              }
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
                // Filter to show only items visible in current map view
                // Only show items after map bounds have been calculated
                const itemsWithCoords = filteredPeople.filter(p => isFinite(p.lat) && isFinite(p.lng));
                const visibleItems = visiblePeopleIds.length > 0
                  ? itemsWithCoords.filter(p => visiblePeopleIds.includes(p.id))
                  : [];
                const itemCount = visibleItems.length;
                const itemLabel = filterType === 'organizations' ? 'organization' : filterType === 'users' ? 'user' : 'item';
                const itemLabelPlural = filterType === 'organizations' ? 'organizations' : filterType === 'users' ? 'users' : 'items';

                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3>{itemCount} {itemCount === 1 ? itemLabel : itemLabelPlural} in this area</h3>
                    </div>
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
                      </div>
                    ) : error ? (
                      <p className="text-red-600 text-sm text-center py-4">{error}</p>
                    ) : itemCount === 0 && visiblePeopleIds.length === 0 ? (
                      <p className="text-[#757575] text-center py-4">Loading map...</p>
                    ) : itemCount === 0 ? (
                      <p className="text-[#757575] text-center py-4">No {itemLabelPlural} in this area. Try zooming out.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {visibleItems.map((person) => (
                          <NetworkPersonCard
                            key={person.id}
                            person={person}
                            compact
                            onSelect={() => person.itemType === 'organization' ? setSelectedOrg(person.id) : setSelectedUser({
                              id: person.id,
                              name: person.name,
                              avatar: person.avatar,
                              role: person.role,
                              organization: person.organization,
                              location: person.location,
                              isConnected: person.isConnected,
                            })}
                          />
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
          ) : filteredPeople.length === 0 ? (
            <p className="text-[#757575] text-center py-8">
              No {filterType === 'organizations' ? 'organizations' : filterType === 'users' ? 'users' : 'items'} found in network
            </p>
          ) : (
            <>
              <div className="mb-3 text-sm text-[#757575]">
                {filteredPeople.length} {filterType === 'organizations' ? 'organizations' : filterType === 'users' ? 'users' : 'items'} in network
              </div>
              <div className="space-y-3">
                {filteredPeople.map((person) => (
                  <NetworkPersonCard
                    key={person.id}
                    person={person}
                    onSelect={() => person.itemType === 'organization' ? setSelectedOrg(person.id) : setSelectedUser({
                      id: person.id,
                      name: person.name,
                      avatar: person.avatar,
                      role: person.role,
                      organization: person.organization,
                      location: person.location,
                      isConnected: person.isConnected,
                    })}
                  />
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
  const isOrg = person.itemType === 'organization';

  return (
    <article onClick={onSelect} className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-3 p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} ${isOrg ? 'rounded-lg' : 'rounded-full'} overflow-hidden flex-shrink-0 bg-gray-100`}>
        {person.avatar ? (
          <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full ${isOrg ? 'bg-[#1976D2]' : 'bg-[#2E7D32]'} flex items-center justify-center text-white text-lg font-semibold`}>
            {isOrg ? (
              <Building2 className="w-6 h-6" />
            ) : (
              person.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            )}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="line-clamp-1">{person.name}</h4>
          {isOrg && (
            <span className="text-xs bg-[#E3F2FD] text-[#1976D2] px-2 py-0.5 rounded-full">Org</span>
          )}
          {person.isConnected && (
            <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full">Connected</span>
          )}
        </div>
        {person.role && person.role !== 'Organization' && <p className="text-sm text-[#757575] line-clamp-1">{person.role}</p>}
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