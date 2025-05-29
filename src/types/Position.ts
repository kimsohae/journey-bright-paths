import { ApiResp, SubwayId, SubwayNm } from "@/types/common";

/**  [지하철역 위치 정보]  */
export type RealtimePosition = {
  totalCount: number;
  rowNum: number;
  selectedCount: number;
  subwayId: SubwayId; 
  subwayNm: string; // 지하철호선명
  statnId: string; // 지하철역 ID
  statnNm: string; // 지하철역명
  trainNo: string; // 열차번호
  lastRecptnDt: string; // 최종수신날짜
  recptnDt: string; // 최종수신시간
  updnLine: "0" | "1"; // 0: 상행/내선 1: 하행/외선
  statnTid: string; // 종착지하철역ID
  statnTnm: string; // 종착지하철역명
  trainSttus: "0" | "1" | "2" | "3"; // 0:진입 1:도착, 2:출발, 3:전역출발, (3은 확인 안됨)
  directAt: "0" | "1" | "7"; // 급행여부, 0: 아님 1: 급행, 7: 특급
  lstcarAt: "0" | "1"; // 막차여부 0: 아님 1: 막차
}


export type RealtimePositionResp = ApiResp<{
  realtimePositionList: RealtimePosition[]
}>

export type RealTimePositionParam = {
  isUpShown?: boolean;
  subwayNm?: SubwayNm;
}


