import { ApiResp } from "@/types/common";

/** [지하철역 도착 정보] */
export type RealtimeArrival = {
  totalCount: number;
  rowNum: number;
  selectedCount: number;
  subwayId: string;
  updnLine: "상행" | "하행";
  statnId: string;
  statnNm: string;
  statnList: string;
  btrainSttus: string;
  barvlDt: string;
  recptnDt: string;
  arvlMsg2: string; // 첫번째 도착 메시지(도착, 출발, 진입 등))
  arvlMsg3: string; // 두 번째 도착 메시지
  arvlCd: string; // 도착 코드 0: 진입, 1: 도착, 2: 출발, 3: 전역출발, 4:전역진입, 5:전역도착, 99:운행중
  lstcarAt: string; // 막차여부  0: 막차아님, 1: 막차
};

export type RealtimeArrivalResp = ApiResp<{
  realtimeArrivalList: RealtimeArrival[];
}>;

/** select 함수로 정제 후 데이터 */
export type RealtimeArrivalElement = {
  arvlMsg: string;
  statnId: string;
  updnLine: "0" | "1";
  recptnDt: string;
}


