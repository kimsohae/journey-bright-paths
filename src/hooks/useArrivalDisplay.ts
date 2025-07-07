

import { ERROR_CODE } from "@/types/common";
import { useFetchArrival } from "@/hooks/useFetchArrival";

/**
 * 도착정보를 UI 렌더링에 적합한 방식으로 가공하여 반환
 * - statn: 지하철역
 * - list : fetch 결과 도착정보 list
 * - code : 에러메시지 분기용 code
 * @returns 
 */
export function useArrivalDisplay() {
  const { data, statn } = useFetchArrival();
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