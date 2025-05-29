import { ErrorCode } from "@/types/common";

/**
 * ErrorMessage
 * data 객체의 code로 분기처리
 * @param param0
 * @returns
 */
export default function ErrorMessage({ code }: { code: ErrorCode }) {
  if (code === "ERROR-337") {
    return <span>금일 API 요청 수 초과로 조회가 불가능합니다. 🥲</span>;
  }
  return <span>도착 정보 요청에 실패했습니다.</span>;
}
