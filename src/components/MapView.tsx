
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { 
  Marker, 
  NavigationControl, 
  Source, 
  Layer,
  MapRef,
  ViewStateChangeEvent,
  MapLayerMouseEvent
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LngLatBounds } from 'mapbox-gl';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

// We'll use a custom token input since the default one isn't working
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

interface Waypoint {
  id: string;
  longitude: number;
  latitude: number;
  name?: string;
  description?: string;
  imageUrl?: string;
}

interface MapViewProps {
  waypoints: Waypoint[];
  onWaypointAdd: (waypoint: Waypoint) => void;
  onWaypointSelect: (waypoint: Waypoint) => void;
  selectedWaypoint: Waypoint | null;
}

interface PlaceResult {
  id: string;
  place_name: string;
  center: [number, number];
  properties: {
    category?: string;
    address?: string;
  };
  text?: string;
  context?: Array<{
    id: string;
    text: string;
  }>;
}

const MapView: React.FC<MapViewProps> = ({
  waypoints,
  onWaypointAdd,
  onWaypointSelect,
  selectedWaypoint
}) => {
  const { toast } = useToast();
  const [viewState, setViewState] = useState({
    longitude: 126.9780,  // Seoul coordinates as default
    latitude: 37.5665,
    zoom: 11
  });

  const [mapboxToken, setMapboxToken] = useState(
    localStorage.getItem('mapbox_token') || DEFAULT_MAPBOX_TOKEN
  );
  
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem('mapbox_token'));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const mapRef = useRef<MapRef>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Generate GeoJSON for route line
  const routeGeoJson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: waypoints.map((wp) => [wp.longitude, wp.latitude])
    }
  };

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  const handleClick = useCallback((event: MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat;
    
    // If we have a selected place, clear it
    if (selectedPlace) {
      setSelectedPlace(null);
      return;
    }

    // Generate a new waypoint
    const newWaypoint = {
      id: `wp-${Date.now()}`,
      longitude: lng,
      latitude: lat,
      name: `Waypoint ${waypoints.length + 1}`
    };
    
    onWaypointAdd(newWaypoint);

    // Get place information for the clicked location
    fetchPlaceInfo(lng, lat);
  }, [waypoints, onWaypointAdd, selectedPlace]);

  const saveMapboxToken = () => {
    localStorage.setItem('mapbox_token', mapboxToken);
    setShowTokenInput(false);
  };

  const searchPlaces = async () => {
    if (!searchQuery.trim() || !mapboxToken) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.features);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching for places:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search for places. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const fetchPlaceInfo = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch place info');
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        setSelectedPlace(data.features[0]);
      }
    } catch (error) {
      console.error('Error fetching place info:', error);
    }
  };

  const handleSelectSearchResult = (place: PlaceResult) => {
    // Add the selected place as a waypoint
    const newWaypoint = {
      id: `wp-${Date.now()}`,
      longitude: place.center[0],
      latitude: place.center[1],
      name: place.place_name,
    };
    
    onWaypointAdd(newWaypoint);
    
    // Update map view to center on the selected place
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: place.center,
        zoom: 14,
        duration: 1500,
      });
    }
    
    setSelectedPlace(place);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
  };

  useEffect(() => {
    // If we have waypoints, fit the map to show all waypoints
    if (mapRef.current && waypoints.length > 1) {
      const bounds = new LngLatBounds();
      waypoints.forEach((waypoint) => {
        bounds.extend([waypoint.longitude, waypoint.latitude]);
      });
      
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      });
    }
  }, [waypoints]);

  if (showTokenInput) {
    return (
      <div className="h-full w-full rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Mapbox API Token Required</h2>
          <p className="mb-4 text-muted-foreground">
            To use the map functionality, please enter your Mapbox public token below. 
            You can find or create your token at <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-travel-purple underline">Mapbox Tokens Page</a>.
          </p>
          <Input
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter your Mapbox token"
            className="mb-4"
          />
          <Button 
            onClick={saveMapboxToken} 
            disabled={!mapboxToken || mapboxToken.length < 20}
            className="w-full"
          >
            Save Token & Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md">
        <div className="relative">
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search for a location..."
            className="pl-10 pr-10 py-2 bg-white shadow-lg rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
            >
              <X size={18} />
            </button>
          )}
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-[300px] overflow-y-auto z-50">
              {searchResults.map((place) => (
                <div
                  key={place.id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSelectSearchResult(place)}
                >
                  <div className="font-medium">{place.text}</div>
                  <div className="text-sm text-gray-500">{place.place_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Map
        ref={mapRef}
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={handleViewStateChange}
        onClick={handleClick}
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
        reuseMaps
        maxZoom={20}
        minZoom={1}
        cooperativeGestures
      >
        <NavigationControl position="top-right" />
        
        {waypoints.length > 1 && (
          <Source id="route" type="geojson" data={routeGeoJson as any}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#9b87f5',
                'line-width': 4,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}
        
        {waypoints.map((waypoint) => (
          <Marker
            key={waypoint.id}
            longitude={waypoint.longitude}
            latitude={waypoint.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onWaypointSelect(waypoint);
              // Also fetch place info when clicking on a marker
              fetchPlaceInfo(waypoint.longitude, waypoint.latitude);
            }}
          >
            <div className="relative cursor-pointer">
              <MapPin
                size={36}
                className={cn(
                  "transition-all duration-300",
                  selectedWaypoint?.id === waypoint.id
                    ? "text-travel-purple fill-travel-purple drop-shadow-lg scale-125"
                    : "text-travel-blue hover:scale-110"
                )}
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md text-xs whitespace-nowrap">
                {waypoint.name || `Waypoint ${waypoints.indexOf(waypoint) + 1}`}
              </div>
            </div>
          </Marker>
        ))}
        
        {/* Place Info Popup */}
        {selectedPlace && (
          <Popover open={!!selectedPlace} onOpenChange={(open) => !open && setSelectedPlace(null)}>
            <PopoverTrigger asChild>
              <div className="hidden">Trigger</div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-white rounded-lg shadow-lg" side="top">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{selectedPlace.place_name}</h3>
                <div className="space-y-2 text-sm">
                  {selectedPlace.properties.category && (
                    <div>Category: {selectedPlace.properties.category}</div>
                  )}
                  {selectedPlace.properties.address && (
                    <div>Address: {selectedPlace.properties.address}</div>
                  )}
                  {selectedPlace.context && (
                    <div>
                      Region: {selectedPlace.context.map(ctx => ctx.text).join(', ')}
                    </div>
                  )}
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => setSelectedPlace(null)}
                    >
                      Close
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedPlace.center[1]},${selectedPlace.center[0]}`, '_blank')}
                    >
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </Map>
      
      {/* Search Button */}
      <Button
        className="absolute bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-10 bg-white hover:bg-gray-100 text-black"
        onClick={searchPlaces}
        disabled={isSearching || !searchQuery.trim()}
      >
        <Search size={20} />
      </Button>
    </div>
  );
};

export default MapView;
