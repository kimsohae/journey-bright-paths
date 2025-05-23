import { queryKeys } from "@/constants/queryKey";
import { Config } from "@/lib/config";
import {
  RealtimePosition,
  RealtimePositionResp,
  SubwayNm,
} from "@/types/Position";
import { useQuery } from "@tanstack/react-query";

interface RealTimePositionParam {
  isUpShown?: boolean;
  subwayNm?: SubwayNm;
}
export function useGetRealtimePosition({
  isUpShown = true,
  subwayNm = "newBundang",
}: RealTimePositionParam) {
  const encodedSubwayNm =
    subwayNm === "bundang"
      ? encodeURIComponent("수인분당선")
      : encodeURIComponent("신분당선");
  const count = subwayNm === "bundang" ? "30" : "20";

  const { data, refetch } = useQuery<
    RealtimePositionResp,
    unknown,
    {
      status: number;
      list: RealtimePosition[];
    }
  >({
    queryFn: async () => {
      return await fetch(
        `${Config.API_BASE_URL}/json/realtimePosition/0/${count}/${encodedSubwayNm}`
      ).then((res) => res.json());
    },
    queryKey: queryKeys.position(subwayNm),
    refetchInterval: 30 * 1000, // 30s
    select: (data) => {
      const status = data.status || data.errorMessage.status;
      const list = data.realtimePositionList
        ? data.realtimePositionList.filter(
            (item) => item.updnLine === (isUpShown ? "0" : "1")
          )
        : [];

      const result = {
        status,
        list,
      };
      return result;
    },
    enabled: !!encodedSubwayNm,
    // throwOnError: true,
  });

  return { data };
}
