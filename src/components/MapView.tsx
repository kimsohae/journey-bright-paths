
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import mapboxgl from 'mapbox-gl';

// Use a free mapbox token for demo purposes
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

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

const MapView: React.FC<MapViewProps> = ({
  waypoints,
  onWaypointAdd,
  onWaypointSelect,
  selectedWaypoint
}) => {
  const [viewState, setViewState] = useState({
    longitude: 126.9780,  // Seoul coordinates as default
    latitude: 37.5665,
    zoom: 11
  });

  const mapRef = useRef<any>(null);

  // Generate GeoJSON for route line
  const routeGeoJson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: waypoints.map((wp) => [wp.longitude, wp.latitude])
    }
  };

  const handleClick = useCallback((event: any) => {
    const { lng, lat } = event.lngLat;
    
    // Generate a new waypoint
    const newWaypoint = {
      id: `wp-${Date.now()}`,
      longitude: lng,
      latitude: lat,
      name: `Waypoint ${waypoints.length + 1}`
    };
    
    onWaypointAdd(newWaypoint);
  }, [waypoints, onWaypointAdd]);

  useEffect(() => {
    // If we have waypoints, fit the map to show all waypoints
    if (mapRef.current && waypoints.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      waypoints.forEach((waypoint) => {
        bounds.extend([waypoint.longitude, waypoint.latitude]);
      });
      
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      });
    }
  }, [waypoints]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <Map
        ref={mapRef}
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleClick}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
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
      </Map>
    </div>
  );
};

export default MapView;
