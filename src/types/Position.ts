export const SUBWAY_ID =  {
  newBundang : "1077",  // 신분당선
  suinBundang : "1075", // 수인분당선
} as const

export type SubwayId = typeof SUBWAY_ID[keyof typeof SUBWAY_ID];


export interface ApiErrorMessage {
  status: number;
  code: string;
  message: string;
}


export interface RealtimePosition {
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

export interface RealtimePositionResp {
  errorMessage: ApiErrorMessage;
  realtimePositionList: RealtimePosition[];
}

export interface RealtimeArrivalResp {
    errorMessage: {
      status: number;
      code: string;
      message: string;
    }
    realtimeArrivalList: {  totalCount:number,
      rowNum:number,
      selectedCount:number,
      subwayId:string,
      updnLine: "상행"| "하행"
      statnId: string,
      statnNm:string,
      statnList:string,
      btrainSttus:string,
      barvlDt:string,
      recptnDt:string, 
      arvlMsg2:string, // 첫번째 도착 메시지(도착, 출발, 진입 등))
      arvlMsg3:string, // 두 번째 도착 메시지
      arvlCd:string,   // 도착 코드 0: 진입, 1: 도착, 2: 출발, 3: 전역출발, 4:전역진입, 5:전역도착, 99:운행중
      lstcarAt:string  // 막차여부  0: 막차아님, 1: 막차 
    }[]  
  }


export interface RealtimeArrival {
  arvlMsg: string,
  statnId: string,
  updnLine: "0"|"1",
  recptnDt: string,          
}

export interface Waypoint {
  id: string;
  longitude: number;
  latitude: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface SubwayPosition {
  bldn_id: string;
  bldn_nm: string;
  route: string;
  lot: string; // longitude
  lat: string; // latitude
}

