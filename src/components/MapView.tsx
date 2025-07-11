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
import { useSearchParamStore } from "@/store/SearchContext";

export default function MapView() {
  const is2D = useSearchParamStore((state) => state.searchParams.is2D);
  const subwayNm = useSearchParamStore((state) => state.searchParams.subwayNm);
  const is3DView = !is2D && subwayNm === "newBundang";
  const [viewState, setViewState] = useState({
    longitude: 127.078,
    latitude: 37.4003,
    zoom: is3DView ? 12 : 10.5,
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

  useEffect(() => {
    if (is3DView) {
      // 현재 3D에서 rotate 시 지하철 방향 전환 안되므로, bearing을 0으로 막아둔다
      mapRef.current?.getMap().easeTo({ bearing: 0 });
    }
  }, [is3DView]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      <SelectPanel />
      <Map
        ref={mapRef}
        {...viewState}
        pitch={is3DView ? 60 : 0}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onMove={handleViewStateChange}
        mapboxAccessToken={Config.MAPBOX_TOKEN}
        attributionControl={true}
        reuseMaps
        touchZoomRotate={is3DView ? false : true}
        maxZoom={14}
        minZoom={8}
        onLoad={handleMapLoad}
      >
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
}
