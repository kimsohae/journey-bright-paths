import { queryKeys } from "@/constants/queryKey";
import { useParamValue } from "@/context/SearchContext";
import { fetchPublicApi } from "@/lib/fetch";
import { RealtimeArrivalElement, RealtimeArrivalResp } from "@/types/arrival";
import { ApiData, ApiError, SUBWAY_ID } from "@/types/common";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
    }));
  return { status, list, code };
}

export function useGetRealtimeArrival(statnNm: string) {
  const queryClient = useQueryClient();
  const { isUpShown, subwayNm } = useParamValue();

  const { data, refetch, isSuccess, isError, error } = useQuery<
    RealtimeArrivalResp,
    ApiError,
    ApiData<RealtimeArrivalElement>
  >({
    queryKey: queryKeys.arrival(statnNm),
    queryFn: async () => {
      const result = await fetchPublicApi({
        endpoint: "realtimeStationArrival",
        params: [0, 5, encodeURIComponent(statnNm)],
      });
      return result;
    },
    enabled: !!statnNm,
    placeholderData: (previousData) => previousData,
    select: (resp) => filterAndMapArrival(resp, subwayNm, isUpShown),
    retry: false,
    staleTime: 30 * 1000,
  });

  // useEffect(() => {
  //   if (subwayNm) {
  //     queryClient.refetchQueries({ queryKey: queryKeys.position(subwayNm) });
  //   }
  // }, [subwayNm, queryClient]);

  return { data, refetch, error, isError, isSuccess };
}
