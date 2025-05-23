import { cn } from "@/lib/utils";
import { useGetRealtimeArrival } from "@/hooks/use-realtime-arrival";
import { useParamValue } from "@/context/SearchContext";

const MobilePanel: React.FC = () => {
  const { statn } = useParamValue();
  const { data } = useGetRealtimeArrival(statn?.name);
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transition-all duration-300 z-10 h-fit"
      )}
    >
      <div className="p-4 flex flex-col justify-between ">
        <h2 className="font-bold text-travel-dark">지하철 도착 정보</h2>
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
          <span className="text-sm text-muted-foreground font-medium">
            역 이름을 클릭하면 도착정보를 찾을 수 있어요
          </span>
        )}
      </div>
    </div>
  );
};

export default MobilePanel;
