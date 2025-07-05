

import { ERROR_CODE } from "@/types/common";
import { useFetchArrival } from "@/hooks/useFetchArrival";
import { useSearchParamStore } from "@/store/SearchContext";

/**
 * 도착정보를 UI 렌더링에 적합한 방식으로 가공하여 반환
 * - statn: 지하철역
 * - list : fetch 결과 도착정보 list
 * - code : 에러메시지 분기용 code
 * @returns 
 */
export function useArrivalDisplay() {
  const { statn } = useSearchParamStore((state)=> state.searchParams);
  const { data } = useFetchArrival(statn?.name);
  const isErrorMessageShown =
    data &&
    !(data.code === ERROR_CODE.noData || data.code === ERROR_CODE.success);

  return {
    statn,
    list: data?.list ?? [],
    isErrorMessageShown,
    code: data?.code,
  };
}