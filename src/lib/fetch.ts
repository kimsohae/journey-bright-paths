import { Config } from "@/lib/config";
import { resourceLimits } from "worker_threads";

/**
 * @endpoint 공공데이터 API endpoint
 * @params 페이징 시작번호/페이징종료번호/지하철명
 * @returns
 */
export const fetchPublicApi = async ({
  endpoint,
  params,
}: {
  endpoint: "realtimePosition" | "realtimeStationArrival";
  params: (number | string)[];
}) => {
  try {
    const result = await fetch(
      `${Config.API_BASE_URL}/json/${endpoint}/${params.join("/")}`
    ).then((res) => res.json());
    return result;
  } catch (e) {
    console.error(e);
  }
};
