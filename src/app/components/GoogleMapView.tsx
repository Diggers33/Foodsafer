import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyAODh4TLy6v__-VM729_O_ZxAcmCq6u-ek';

interface Location {
  id: string;
  name: string;
  category: string;
  position: { lat: number; lng: number };
  thumbnail: string;
}

interface GoogleMapViewProps {
  locations: Location[];
  onMarkerClick: (id: string) => void;
  onBoundsChange?: (visibleIds: string[]) => void;
}

export function GoogleMapView({ locations, onMarkerClick, onBoundsChange }: GoogleMapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [boundsDebounceTimer, setBoundsDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Default fallback location (London, UK)
  const fallbackCenter = { lat: 51.5074, lng: -0.1278 };

  useEffect(() => {
    // Get user's location from IP address (no permission required)
    const getLocationFromIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setUserLocation({
            lat: data.latitude,
            lng: data.longitude,
          });
        }
      } catch (error) {
        console.log('IP geolocation failed:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getLocationFromIP();
  }, []);

  // Use user location if available, otherwise fall back to default
  const mapCenter = userLocation || fallbackCenter;

  const selectedMarker = locations.find(loc => loc.id === selectedLocation);

  if (isLoadingLocation) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-[50vh] w-full">
        <Map
          mapId="foodsafer-network-map"
          defaultCenter={mapCenter}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
          onIdle={(event) => {
            // Use onIdle instead of onBoundsChanged to prevent flashing
            // onIdle fires after the map has finished moving/zooming
            if (onBoundsChange) {
              const map = event.map;
              const bounds = map.getBounds();
              if (bounds) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                const visibleIds = locations
                  .filter(loc => bounds.contains(new google.maps.LatLng(loc.position.lat, loc.position.lng)))
                  .map(loc => loc.id);
                console.log(`Map bounds: NE(${ne.lat().toFixed(2)}, ${ne.lng().toFixed(2)}) SW(${sw.lat().toFixed(2)}, ${sw.lng().toFixed(2)}), visible: ${visibleIds.length}/${locations.length}`);
                onBoundsChange(visibleIds);
              }
            }
          }}
        >
          {/* User's current location marker */}
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 bg-[#4285F4] rounded-full border-2 border-white shadow-lg" />
                <div className="absolute w-8 h-8 bg-[#4285F4]/20 rounded-full animate-pulse" />
              </div>
            </AdvancedMarker>
          )}

          {/* Location markers */}
          {locations.map((location) => (
            <AdvancedMarker
              key={location.id}
              position={location.position}
              onClick={() => {
                setSelectedLocation(location.id);
                onMarkerClick(location.id);
              }}
            >
              <div className="relative flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                {location.thumbnail ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white bg-white">
                    <img
                      src={location.thumbnail}
                      alt={location.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to pin icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                        `;
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <MapPin className="w-6 h-6 text-white" fill="white" />
                  </div>
                )}
              </div>
            </AdvancedMarker>
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {selectedMarker.name}
                </h4>
                <p className="text-xs text-gray-600">
                  {selectedMarker.category}
                </p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}