import React, { useState, useCallback, useRef, useEffect } from "react";
import Map, {
  NavigationControl,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import UpDownPanel from "./UpDownPanel";
import { Waypoint } from "@/types/Position";
import { BUNDANG_WAYPOINTS, NEW_BUNDANG_WAYPOINTS } from "@/constants/subway";
import MapSubwayLine from "./MapSubwayLine";

// We'll use a custom token input since the default one isn't working
const DEFAULT_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapViewProps {
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
        <MapSubwayLine
          waypoints={NEW_BUNDANG_WAYPOINTS}
          onWaypointSelect={onWaypointSelect}
          selectedWaypoint={selectedWaypoint}
        />
      </Map>
    </div>
  );
};

export default MapView;
