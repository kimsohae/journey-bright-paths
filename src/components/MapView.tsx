import { useState, useCallback, useRef, useEffect } from "react";
import Map, {
  NavigationControl,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { BUNDANG_WAYPOINTS, NEW_BUNDANG_WAYPOINTS } from "@/constants/subway";
import mapboxgl from "mapbox-gl";
import SelectPanel from "./SelectPanel";
import MapSubwayLine from "./MapSubwayLine";
import { Config } from "@/lib/config";
import { throttle } from "@/lib/utils";
import ParkMarker from "./ParkMarker";

interface MapViewProps {}

const MapView: React.FC<MapViewProps> = ({}) => {
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

  useEffect(() => {
    const handleResize = throttle(() => {
      mapRef.current?.resize();
    }, 1000);

    // 강제 resize 트리거
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 1000); // 초기 진입 시 한 번 강제 resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      <SelectPanel />
      <Map
        ref={mapRef}
        {...viewState}
        // pitch={30}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onMove={handleViewStateChange}
        mapboxAccessToken={Config.MAPBOX_TOKEN}
        attributionControl={true}
        reuseMaps
        maxZoom={14}
        minZoom={8}
        onLoad={handleMapLoad}
      >
        <ParkMarker />
        <NavigationControl position="top-right" />
        {/** 수인분당선 */}
        <MapSubwayLine subwayNm="bundang" waypoints={BUNDANG_WAYPOINTS} />
        {/** 신분당선 */}
        <MapSubwayLine
          subwayNm="newBundang"
          waypoints={NEW_BUNDANG_WAYPOINTS}
        />
      </Map>
    </div>
  );
};

export default MapView;
