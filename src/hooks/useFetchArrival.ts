import { queryKeys } from "@/constants/queryKey";
import { fetchPublicApi } from "@/lib/fetch";
import { useSearchParamStore } from "@/store/SearchContext";
import { RealtimeArrivalElement, RealtimeArrivalResp } from "@/types/arrival";
import { ApiData, ApiError, SUBWAY_ID } from "@/types/common";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/** select  */
function filterAndMapArrival(
  resp: RealtimeArrivalResp,
  subwayNm: string,
  isUpShown: boolean
): ApiData<RealtimeArrivalElement> {
  const status = resp.status || resp.errorMessage.status;
  const code = resp.code || resp.errorMessage?.code;
  const list: RealtimeArrivalElement[] = (resp.realtimeArrivalList ?? [])
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
      trainLineNm: item.trainLineNm,
    }));
  return { status, list, code };
}

export function useFetchArrival() {
  const { isUpShown, subwayNm, statn} = useSearchParamStore((state) => state.searchParams);
  const statnName = statn?.name;
  const queryClient = useQueryClient();
  
  
  const { data, refetch, isSuccess, isError, error } = useQuery<
  RealtimeArrivalResp,
  ApiError,
  ApiData<RealtimeArrivalElement>
  >({
    queryKey: queryKeys.arrival(statnName),
    queryFn: async () => {
      // 검색 시 괄호 제거 ex) 양재(서초구청) ->양재
      const trimmedStatnNm =  statnName?.replace(/\(.*?\)/g, "").trim();
      const result = await fetchPublicApi({
        endpoint: "realtimeStationArrival",
        params: [0, 10, encodeURIComponent(trimmedStatnNm)],
      });
      return result;
    },
    enabled: !!statnName,
    placeholderData: (previousData) => previousData,
    select: (resp) => filterAndMapArrival(resp, subwayNm, isUpShown),
    retry: false,
    staleTime: 1000,
  });

  useEffect(() => {
    if (subwayNm) {
      queryClient.refetchQueries({ queryKey: queryKeys.position(subwayNm) });
    }
  }, [subwayNm, queryClient]);

  return { data, refetch, error, isError, isSuccess, statn };
}
