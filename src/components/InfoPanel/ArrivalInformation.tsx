import { useParamValue } from "@/context/SearchContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetRealtimeArrival } from "@/hooks/use-realtime-arrival";
import { formatKoreanDateTime } from "@/lib/utils";
import { ERROR_CODE } from "@/types/common";
import ErrorMessage from "@/components/InfoPanel/ErrorMessage";
import DefaultMessage from "./DefaultMessage";

export default function ArrivalInformation() {
  const isMobile = useIsMobile();
  const { statn } = useParamValue();
  const { data } = useGetRealtimeArrival(statn?.name);
  const isErrorMessageShown =
    data &&
    !(data.code === ERROR_CODE.noData || data.code === ERROR_CODE.success);

  if (isErrorMessageShown) {
    return <ErrorMessage code={data.code} />;
  }

  if (!isMobile) {
    return (
      <div>
        {statn ? (
          <>
            <div>
              <label className="text-sm font-medium text-gray-500">
                역 이름
              </label>
              <div>{statn?.name}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                도착정보
              </label>
              {/* <div className="flex flex-col"> */}
              <ul className="flex flex-col">
                {data?.list.length > 0
                  ? data.list.map((item) => (
                      <li
                        key={`${item.arvlMsg}-${item.statnId}-${item.updnLine}-${item.recptnDt}`}
                      >
                        - {item.arvlMsg}
                      </li>
                    ))
                  : "-"}
              </ul>
              {/* </div> */}
            </div>

            {data?.list.length > 0 ? (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  조회시간
                </label>
                <div className="flex flex-col text-xs font-medium text-gray-500">
                  {formatKoreanDateTime(data.list[0]?.recptnDt)}
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="flex gap-2 pt-4"></div>
          </>
        ) : (
          <DefaultMessage />
        )}
      </div>
    );
  }

  return (
    <>
      {statn ? (
        <div className="inline-block">
          <div>
            <div>{statn?.name}</div>
          </div>
          <div>
            <div className="flex flex-col text-sm">
              {data?.list.length > 0
                ? data.list.map((item) => (
                    <span
                      key={`${item.arvlMsg}-${item.statnId}-${item.updnLine}-${item.recptnDt}`}
                    >
                      {item.arvlMsg}
                    </span>
                  ))
                : "-"}
            </div>
          </div>
        </div>
      ) : (
        <DefaultMessage />
      )}
    </>
  );
}
