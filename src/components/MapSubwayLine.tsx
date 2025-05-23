import { Marker, Source, Layer } from "react-map-gl";
import { Waypoint } from "@/types/Position";
import MapSubwayPosition from "./MapSubwayPosition";
import { cn } from "@/lib/utils";

interface Props {
  waypoints: Waypoint[];
  onWaypointSelect: (waypoint: Waypoint) => void;
  selectedWaypoint: Waypoint | null;
}
export default function MapSubwayLine({
  waypoints,
  onWaypointSelect,
  selectedWaypoint,
}: Props) {
  const routeGeoJson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: waypoints.map((wp) => [wp.longitude, wp.latitude]),
    },
  };

  return (
    <>
      {waypoints.length > 1 && (
        <Source id="route" type="geojson" data={routeGeoJson as any}>
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
      {waypoints.map((waypoint) => (
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
    </>
  );
}
