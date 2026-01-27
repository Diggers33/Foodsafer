import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { MapPin } from 'lucide-react';

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
}

export function GoogleMapView({ locations, onMarkerClick }: GoogleMapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Center map on Portland, OR by default
  const defaultCenter = { lat: 45.5155, lng: -122.6789 };

  const selectedMarker = locations.find(loc => loc.id === selectedLocation);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-[50vh] w-full">
        <Map
          mapId="foodsafer-network-map"
          defaultCenter={defaultCenter}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          {locations.map((location) => (
            <AdvancedMarker
              key={location.id}
              position={location.position}
              onClick={() => {
                setSelectedLocation(location.id);
                onMarkerClick(location.id);
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" fill="white" />
                </div>
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