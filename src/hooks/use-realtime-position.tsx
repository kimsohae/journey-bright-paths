import { queryKeys } from "@/constants/queryKey";
import { RealtimePosition, RealtimePositionResp } from "@/types/Position";
import { useQuery } from "@tanstack/react-query";

const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;

interface RealTimePositionParam {
  isUpShown?: boolean;
  subwayNm?: "bundang" | "newBundang";
}
export function useGetRealtimePosition({
  isUpShown = true,
  subwayNm = "newBundang",
}: RealTimePositionParam) {
  const encodedSubwayNm =
    subwayNm === "bundang"
      ? encodeURIComponent("분당선")
      : encodeURIComponent("신분당선");
  const { data, refetch } = useQuery<
    RealtimePositionResp,
    unknown,
    RealtimePosition[]
  >({
    queryFn: async () => {
      return await fetch(
        `http://swopenapi.seoul.go.kr/api/subway/${PUBLIC_API_KEY}/json/realtimePosition/0/20/${encodedSubwayNm}`
      ).then((res) => res.json());
    },
    queryKey: queryKeys.position,
    refetchInterval: 30 * 1000, // 30s
    select: (data) =>
      data.realtimePositionList.filter(
        (item) => item.updnLine === (isUpShown ? "0" : "1")
      ),
    enabled: !!encodedSubwayNm,
  });

  return { data, refetch };
}
