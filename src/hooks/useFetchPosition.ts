import { queryKeys } from "@/constants/queryKey";
import { fetchPublicApi } from "@/lib/fetch";
import { ApiData } from "@/types/common";
import {
  RealtimePosition,
  RealTimePositionParam,
  RealtimePositionResp,
} from "@/types/position";
import { useQuery } from "@tanstack/react-query";

function filterAndMapPosition(resp: RealtimePositionResp, isUpShown: boolean) {
  const status = resp.status || resp.errorMessage.status;
  const code = resp.code || resp.errorMessage?.code;
  const list = resp.realtimePositionList
    ? resp.realtimePositionList.filter(
        (item) => item.updnLine === (isUpShown ? "0" : "1")
      )
    : [];

  const result = {
    status,
    code,
    list,
  };
  return result;
}

export function useFetchPosition({
  isUpShown = true,
  subwayNm = "newBundang",
}: RealTimePositionParam) {
  const encodedSubwayNm =
    subwayNm === "bundang"
      ? encodeURIComponent("수인분당선")
      : encodeURIComponent("신분당선");
  const count = subwayNm === "bundang" ? "30" : "20";

  const { data } = useQuery<
    RealtimePositionResp,
    unknown,
    ApiData<RealtimePosition>
  >({
    queryFn: async () =>
      fetchPublicApi({
        endpoint: "realtimePosition",
        params: [0, count, encodedSubwayNm],
      }),
    queryKey: queryKeys.position(subwayNm),
    refetchInterval: 30 * 1000, // 30s
    select: (data) => filterAndMapPosition(data, isUpShown),
    retry: false,
    enabled: !!encodedSubwayNm,

    throwOnError: true,
  });

  return { data };
}
