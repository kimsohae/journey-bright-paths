import { queryKeys } from "@/constants/queryKey";
import { useParamValue } from "@/context/SearchContext";
import { Config } from "@/lib/config";
import {
  RealtimeArrival,
  RealtimeArrivalResp,
  SUBWAY_ID,
} from "@/types/Position";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetRealtimeArrival(statnNm: string) {
  const queryClient = useQueryClient();
  const { isUpShown, subwayNm } = useParamValue();
  const { data, refetch } = useQuery<
    RealtimeArrivalResp,
    unknown,
    {
      status: number;
      list: RealtimeArrival[];
    }
  >({
    queryKey: queryKeys.arrival(statnNm),
    queryFn: async () => {
      queryClient.refetchQueries({ queryKey: queryKeys.position(subwayNm) });
      return await fetch(
        `${
          Config.API_BASE_URL
        }/json/realtimeStationArrival/0/5/${encodeURIComponent(statnNm)}`
      ).then((res) => res.json());
    },
    enabled: !!statnNm,
    select: (data) => {
      const realtimeArrivalList = data.realtimeArrivalList;
      const status = data.status || data.errorMessage.status;

      if (!realtimeArrivalList) return { status, list: [] };
      return {
        status,
        list: realtimeArrivalList
          .filter(
            (item) =>
              item.subwayId === SUBWAY_ID[subwayNm] &&
              (isUpShown ? item.updnLine === "상행" : item.updnLine === "하행")
          )
          .map((item) => ({
            arvlMsg: item.arvlMsg2,
            statnId: item.statnId,
            updnLine: item.updnLine === "상행" ? "0" : "1",
            recptnDt: item.recptnDt,
          })),
      };
    },
    staleTime: 1000,
  });

  return { data, refetch };
}
