import { useState } from 'react';
import { Search, Filter, List, MapPin, Navigation, MessageSquare, Users as UsersIcon } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { OrganizationDetail } from './OrganizationDetail';
import { MessagesList } from './MessagesList';
import { ConnectionsList } from './ConnectionsList';
import { NetworkSearch } from './NetworkSearch';
import { GoogleMapView } from './GoogleMapView';

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

const mockItems: NetworkItem[] = [
  {
    id: '1',
    name: 'FreshPro Organic Foods',
    category: 'Food Manufacturer',
    location: 'Portland, OR',
    distance: '2.3 mi',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    lat: 45.5155,
    lng: -122.6789,
  },
  {
    id: '2',
    name: 'SafetyFirst Lab Services',
    category: 'Testing Laboratory',
    location: 'Portland, OR',
    distance: '4.7 mi',
    thumbnail: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400&h=300&fit=crop',
    lat: 45.5231,
    lng: -122.6765,
  },
  {
    id: '3',
    name: 'NutriGreen Solutions',
    category: 'Consultant',
    location: 'Beaverton, OR',
    distance: '8.1 mi',
    thumbnail: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop',
    lat: 45.4871,
    lng: -122.8037,
  },
  {
    id: '4',
    name: 'Pacific Food Safety Institute',
    category: 'Training Provider',
    location: 'Portland, OR',
    distance: '5.2 mi',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
    lat: 45.5289,
    lng: -122.6625,
  },
];

export function NetworkMap({ onProfileClick }: { onProfileClick: () => void }) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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

  // Convert mockItems to Google Maps location format
  const mapLocations = mockItems.map(item => ({
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
              // Optional: Auto-scroll to the item in the bottom sheet
              console.log('Marker clicked:', id);
            }}
          />

          {/* Bottom Sheet */}
          <div className="bg-white rounded-t-2xl shadow-lg -mt-6 relative z-10">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3"></div>
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3>{mockItems.length} items in this area</h3>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockItems.map((item) => (
                  <NetworkItemCard key={item.id} item={item} compact onSelect={() => setSelectedOrg(item.id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="px-4 py-4">
          <div className="mb-3 text-sm text-[#757575]">
            {mockItems.length} organizations near you
          </div>
          <div className="space-y-3">
            {mockItems.map((item) => (
              <NetworkItemCard key={item.id} item={item} onSelect={() => setSelectedOrg(item.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NetworkItemCard({ item, compact = false, onSelect }: { item: NetworkItem; compact?: boolean; onSelect: () => void }) {
  return (
    <article onClick={onSelect} className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-3 p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} rounded-lg overflow-hidden flex-shrink-0 bg-gray-100`}>
        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
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