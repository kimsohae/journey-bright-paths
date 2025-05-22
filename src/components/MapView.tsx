import React, { useState, useCallback, useRef, useEffect } from "react";
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
  MapRef,
  ViewStateChangeEvent,
  MapLayerMouseEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import MapSubwayPosition from "./MapSubwayPosition";
import UpDownPanel from "./UpDownPanel";
import { Waypoint } from "@/types/Position";
import { BUNDANG_WAYPOINTS, NEW_BUNDANG_WAYPOINTS } from "@/constants/subway";

// We'll use a custom token input since the default one isn't working
const DEFAULT_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapViewProps {
  onWaypointAdd: (waypoint: Waypoint) => void;
  onWaypointSelect: (waypoint: Waypoint) => void;
  selectedWaypoint: Waypoint | null;
}

const MapView: React.FC<MapViewProps> = ({
  onWaypointSelect,
  selectedWaypoint,
}) => {
  const [viewState, setViewState] = useState({
    longitude: 127.078,
    latitude: 37.4003,
    zoom: 10.5,
  });

  const mapRef = useRef<MapRef>(null);

  // Generate GeoJSON for route line
  const bundangRouteGeoJson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: BUNDANG_WAYPOINTS.map((wp) => [wp.longitude, wp.latitude]),
    },
  };

  const newBundangRouteGeoJson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: NEW_BUNDANG_WAYPOINTS.map((wp) => [
        wp.longitude,
        wp.latitude,
      ]),
    },
  };

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  const handleMapLoad = (e: mapboxgl.MapboxEvent) => {
    const map = e.target;
    map.setMaxBounds([
      [126.6, 37.1], // Southwest
      [127.3, 37.8], // Northeast
    ]);
  };

  // useEffect(() => {
  //   // If we have waypoints, fit the map to show all waypoints
  //   if (mapRef.current && NEW_BUNDANG_WAYPOINTS.length > 1) {
  //     const bounds = new LngLatBounds();
  //     NEW_BUNDANG_WAYPOINTS.forEach((waypoint) => {
  //       bounds.extend([waypoint.longitude, waypoint.latitude]);
  //     });

  //     mapRef.current.fitBounds(bounds, {
  //       padding: 100,
  //       duration: 1000,
  //     });
  //   }
  // }, [NEW_BUNDANG_WAYPOINTS]);

  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.resize();
    };

    // 강제 resize 트리거
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 100); // 초기 진입 시 한 번 강제 resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      {/* Search Bar */}
      <UpDownPanel />
      <Map
        ref={mapRef}
        {...viewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onMove={handleViewStateChange}
        mapboxAccessToken={DEFAULT_MAPBOX_TOKEN}
        attributionControl={false}
        reuseMaps
        maxZoom={14}
        minZoom={8}
        onLoad={handleMapLoad}
      >
        <NavigationControl position="top-right" />

        {/** 신분당선 */}
        {NEW_BUNDANG_WAYPOINTS.length > 1 && (
          <Source
            id="route"
            type="geojson"
            data={newBundangRouteGeoJson as any}
          >
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#D20F46",
                "line-width": 4,
                "line-opacity": 0.8,
              }}
            />
            <MapSubwayPosition />
          </Source>
        )}
        {NEW_BUNDANG_WAYPOINTS.map((waypoint) => (
          <Marker
            key={waypoint.id}
            longitude={waypoint.longitude}
            latitude={waypoint.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onWaypointSelect(waypoint);
            }}
          >
            <div className="cursor-pointer">
              <div
                className={cn(
                  "relative z-0 w-3 h-3 transition-all duration-300 rounded-full border-2 drop-shadow-lg ",
                  selectedWaypoint?.id === waypoint.id
                    ? "bg-newBundang border-white scale-125"
                    : "bg-white border-newBundang"
                )}
              >
                <div className="z-10 absolute w-fit top-1/2 left-3 transform -translate-y-1/2  bg-white px-2 py-1 rounded-full shadow-md text-xs text-gray-900 font-semibold whitespace-nowrap">
                  {waypoint.name}
                </div>
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapView;
