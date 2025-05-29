export const ERROR_CODE = {
  success: "INFO-000",
  noData: "INFO-200",
  exceed: "ERROR-337",
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]; // INFO-200: 데이터 없음 INFO-337:

export interface ApiErrorMessage {
  status: number;
  code: ErrorCode;
}

export class ApiError extends Error {
  errorMessage: ApiErrorMessage;
  constructor(message: string, errorData: ApiErrorMessage) {
    super(message);
    this.errorMessage = errorData;
  }
}

export type ApiResp<T> = {
  status?: number;
  code?:ErrorCode;
  errorMessage?: {
    status: number;
    code: ErrorCode;
    message: string;
  };
} & T;

/** 지하철역 정보 */
export const SUBWAY_ID = {
  newBundang: "1077", // 신분당선
  bundang: "1075", // 수인분당선
} as const;

export type SubwayId = (typeof SUBWAY_ID)[keyof typeof SUBWAY_ID];
export type SubwayNm = keyof typeof SUBWAY_ID;

export type Waypoint = {
  id: string;
  longitude: number;
  latitude: number;
  name: string;
}

/** 데이터 정제 후 react-query에서 반환하는 데이터 */
export type ApiData<T> = {
  status: number;
  code: ErrorCode;
  list: T[];
}



/** ------- 미사용  */

// export interface SubwayPosition {
//   bldn_id: string;
//   bldn_nm: string;
//   route: string;
//   lot: string; // longitude
//   lat: string; // latitude
// }

