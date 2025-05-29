import { useArrivalDisplay } from "@/hooks/useArrivalDisplay";
import DefaultMessage from "@/components/infoPanel/common/DefaultMessage";
import ErrorMessage from "@/components/infoPanel/common/ErrorMessage";

export default function MobileInfo() {
  const { statn, list, isErrorMessageShown, code } = useArrivalDisplay();
  if (!statn) {
    return <DefaultMessage />;
  }

  if (isErrorMessageShown) {
    return <ErrorMessage code={code} />;
  }

  return (
    <div className="inline-block">
      <div>
        <div>{statn?.name}</div>
      </div>
      <div>
        <div className="flex flex-col text-sm">
          {list.length > 0
            ? list.map((item) => (
                <span
                  key={`${item.arvlMsg}-${item.statnId}-${item.updnLine}-${item.recptnDt}-${item.trainLineNm}`}
                >
                  {item.arvlMsg}
                </span>
              ))
            : "-"}
        </div>
      </div>
    </div>
  );
}
