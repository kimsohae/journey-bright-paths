import { queryKeys } from "@/constants/queryKey";
import { useSearchParam } from "@/context/SearchContext";
import {
  RealtimeArrival,
  RealtimeArrivalResp,
  SUBWAY_ID,
} from "@/types/Position";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;

export function useGetRealtimeArrival(statnNm: string) {
  const queryClient = useQueryClient();
  const { isUpShown } = useSearchParam();
  const { data, refetch } = useQuery<
    RealtimeArrivalResp,
    unknown,
    RealtimeArrival[]
  >({
    queryKey: queryKeys.arrival(statnNm),
    queryFn: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.position });
      return await fetch(
        `https://swopenapi.seoul.go.kr/api/subway/${PUBLIC_API_KEY}/json/realtimeStationArrival/0/5/${statnNm}`
      ).then((res) => res.json());
    },
    enabled: !!statnNm,
    select: (data) => {
      const realtimeArrivalList = data.realtimeArrivalList;
      if (!realtimeArrivalList) return [];

      return realtimeArrivalList
        .filter(
          (item) =>
            item.subwayId === SUBWAY_ID.newBundang &&
            (isUpShown ? item.updnLine === "상행" : item.updnLine === "하행")
        )
        .map((item) => ({
          arvlMsg: item.arvlMsg2,
          statnId: item.statnId,
          updnLine: item.updnLine === "상행" ? "0" : "1",
          recptnDt: item.recptnDt,
        }));
    },
    staleTime: 1000,
  });

  return { data, refetch };
}
