import { formatKoreanDateTime } from "@/lib/utils";
import { useArrivalDisplay } from "@/hooks/useArrivalDisplay";
import DefaultMessage from "@/components/infoPanel/common/DefaultMessage";
import ErrorMessage from "@/components/infoPanel/common/ErrorMessage";

export default function DesktopInfo() {
  const { statn, list, isErrorMessageShown, code } = useArrivalDisplay();
  if (!statn) {
    return <DefaultMessage />;
  }

  if (isErrorMessageShown) {
    return <ErrorMessage code={code} />;
  }

  return (
    <div>
      <div>
        <label className="text-sm font-medium text-gray-500">역 이름</label>
        <div>{statn?.name}</div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500">도착정보</label>
        <ul className="flex flex-col">
          {list.length > 0
            ? list.map((item) => (
                <li
                  key={`${item.arvlMsg}-${item.statnId}-${item.updnLine}-${item.recptnDt}-${item.trainLineNm}`}
                >
                  - {item.arvlMsg}
                </li>
              ))
            : "-"}
        </ul>
      </div>

      {list.length > 0 ? (
        <div>
          <label className="text-sm font-medium text-gray-500">조회시간</label>
          <div className="flex flex-col text-xs font-medium text-gray-500">
            {formatKoreanDateTime(list[0]?.recptnDt)}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
