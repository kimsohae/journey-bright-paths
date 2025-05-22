import { memo } from "react";
import { useGetRealtimePosition } from "@/hooks/use-realtime-position";
import { RealtimePosition } from "@/types/Position";
import { Marker } from "react-map-gl";
import { TriangleIcon } from "lucide-react";
import { useSearchParam } from "@/context/SearchContext";
import { NEW_BUNDANG_MAP, NEW_BUNDANG_WAYPOINTS } from "@/constants/subway";
import { getBearing } from "@/lib/utils";

const MapSubwayPosition = memo(() => {
  const { isUpShown } = useSearchParam();
  const { data } = useGetRealtimePosition({
    isUpShown,
  });
  return (
    <>
      {data?.map((position: RealtimePosition) => {
        const { statnId, trainSttus, updnLine } = position;
        const { latitude, longitude, index } = NEW_BUNDANG_MAP[statnId];
        let [positionLatitude, positionLongitude] = [latitude, longitude];
        let targetPosition;
        let bearing; // 방향

        // 0 : 이전역과 현재역 중간
        // 1, 2 : 현재역과 다음역 중간
        if (trainSttus === "0") {
          targetPosition =
            updnLine === "0"
              ? NEW_BUNDANG_WAYPOINTS[index - 1]
              : NEW_BUNDANG_WAYPOINTS[index + 1];
        } else if (trainSttus === "1" || trainSttus === "2") {
          targetPosition =
            updnLine === "0"
              ? NEW_BUNDANG_WAYPOINTS[index + 1]
              : NEW_BUNDANG_WAYPOINTS[index - 1];
        }

        positionLatitude =
          (latitude +
            (trainSttus === "1"
              ? latitude
              : targetPosition?.latitude || latitude)) /
          2;
        positionLongitude =
          (longitude +
            (trainSttus === "1"
              ? longitude
              : targetPosition?.longitude || longitude)) /
          2;

        bearing = getBearing(
          latitude,
          longitude,
          targetPosition?.latitude || latitude,
          targetPosition?.longitude || longitude,
          trainSttus === "0"
        );

        return (
          <Marker
            key={`${statnId}-${trainSttus}-${updnLine}`}
            latitude={positionLatitude}
            longitude={positionLongitude}
          >
            {updnLine === "0" ? (
              <TriangleIcon
                className=" w-5 h-5 fill-newBundang stroke-newBundang"
                transform={`rotate(${bearing})`}
              />
            ) : (
              <TriangleIcon
                className="w-5 h-5 fill-newBundang stroke-newBundang"
                transform={`rotate(${bearing})`}
              />
            )}
          </Marker>
        );
      })}
    </>
  );
});

export default MapSubwayPosition;
