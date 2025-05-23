import { Marker, Source, Layer } from "react-map-gl";
import { SubwayNm, Waypoint } from "@/types/Position";
import MapSubwayPosition from "./MapSubwayPosition";
import { cn } from "@/lib/utils";
import { useParamAction, useParamValue } from "@/context/SearchContext";

const COLOR_HEX = {
  newBundang: "#D20F46",
  bundang: "#FABE00",
};

interface Props {
  subwayNm: SubwayNm;
  waypoints: Waypoint[];
}
export default function MapSubwayLine({ subwayNm, waypoints }: Props) {
  const { subwayNm: selectedSubwayNm, statn } = useParamValue();
  const setParam = useParamAction();
  const isSelectedSubway = subwayNm === selectedSubwayNm;
  const lineColor = isSelectedSubway ? COLOR_HEX[subwayNm] : "#bebebe";
  const routeGeoJson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: waypoints.map((wp) => [wp.longitude, wp.latitude]),
    },
  };

  if (selectedSubwayNm !== subwayNm) {
    return (
      <Source
        id={`route-${subwayNm}`}
        type="geojson"
        data={routeGeoJson as any}
      ></Source>
    );
  }

  return (
    <>
      {waypoints.length > 1 && (
        <Source
          id={`route-${subwayNm}`}
          type="geojson"
          data={routeGeoJson as any}
        >
          <Layer
            id={`route-line-${subwayNm}`}
            type="line"
            paint={{
              "line-color": lineColor,
              "line-width": 4,
              "line-opacity": 0.8,
            }}
          />
          {selectedSubwayNm === subwayNm && (
            <MapSubwayPosition subwayNm={subwayNm} />
          )}
        </Source>
      )}
      {waypoints.map((waypoint) => (
        <Marker
          key={`${subwayNm}-${waypoint.id}`}
          longitude={waypoint.longitude}
          latitude={waypoint.latitude}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setParam({
              statn: { id: waypoint.id, name: waypoint.name },
            });
          }}
        >
          <div className="cursor-pointer">
            <div
              className={cn(
                "relative z-0 w-3 h-3 transition-all will-change-transform duration-300 rounded-full border-2 drop-shadow-lg ",
                statn?.id === waypoint.id
                  ? `${
                      subwayNm === "bundang" ? "bg-bundang" : "bg-newBundang"
                    } border-white scale-125`
                  : `bg-white ${
                      subwayNm === "bundang"
                        ? "border-bundang"
                        : "border-newBundang"
                    }`,
                `${selectedSubwayNm === subwayNm ? "" : "border-gray-400"}`
              )}
            >
              <div
                className={cn([
                  "z-10 absolute w-fit top-1/2 left-3 transform -translate-y-1/2  bg-white px-2 py-1 rounded-full shadow-md text-xs font-semibold whitespace-nowrap",
                  isSelectedSubway ? "text-gray-900" : "text-gray-400",
                ])}
              >
                {waypoint.name}
              </div>
            </div>
          </div>
        </Marker>
      ))}
    </>
  );
}
