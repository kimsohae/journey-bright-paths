import { memo } from "react";
import { useGetRealtimePosition } from "@/hooks/use-realtime-position";
import { RealtimePosition } from "@/types/position";
import { Marker } from "react-map-gl";
import { TriangleIcon } from "lucide-react";
import { useParamValue } from "@/context/SearchContext";
import {
  BUNDANG_MAP,
  BUNDANG_WAYPOINTS,
  NEW_BUNDANG_MAP,
  NEW_BUNDANG_WAYPOINTS,
} from "@/constants/subway";
import { getBearing } from "@/lib/utils";

interface Props {
  subwayNm: "bundang" | "newBundang";
}

const MapSubwayPosition = memo(({ subwayNm }: Props) => {
  const { isUpShown } = useParamValue();
  const { data } = useGetRealtimePosition({
    isUpShown,
    subwayNm,
  });
  const subwayMap = subwayNm === "bundang" ? BUNDANG_MAP : NEW_BUNDANG_MAP;
  const subwayWaypoints =
    subwayNm === "bundang" ? BUNDANG_WAYPOINTS : NEW_BUNDANG_WAYPOINTS;

  return (
    <>
      {data?.list.map((position: RealtimePosition) => {
        const { statnId, trainSttus, updnLine } = position;
        const { latitude, longitude, index } = subwayMap[statnId];
        let [positionLatitude, positionLongitude] = [latitude, longitude];
        let targetPosition;
        let bearing; // 방향

        // 0 : 이전역과 현재역 중간
        // 1, 2 : 현재역과 다음역 중간
        if (trainSttus === "0") {
          targetPosition =
            updnLine === "0"
              ? subwayWaypoints[index - 1]
              : subwayWaypoints[index + 1];
        } else if (trainSttus === "1" || trainSttus === "2") {
          targetPosition =
            updnLine === "0"
              ? subwayWaypoints[index + 1]
              : subwayWaypoints[index - 1];
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
            <TriangleIcon
              className={`w-5 h-5 ${
                subwayNm === "bundang"
                  ? "fill-bundang stroke-bundang"
                  : "fill-newBundang stroke-newBundang"
              }`}
              style={{
                rotate: `${bearing}deg`,
              }}
            />
          </Marker>
        );
      })}
    </>
  );
});

export default MapSubwayPosition;
