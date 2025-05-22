import { Waypoint } from "@/types/Position";
import { useGetRealtimeArrival } from "@/hooks/use-realtime-arrival";
import { formatKoreanDateTime } from "@/lib/utils";

interface WaypointPanelProps {
  waypoint: Waypoint | null;
}

const WaypointPanel: React.FC<WaypointPanelProps> = ({ waypoint }) => {
  const { data } = useGetRealtimeArrival(encodeURIComponent(waypoint?.name));

  return (
    <div className="glass-card p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">지하철 도착 정보</h3>
      </div>

      <div className="space-y-4">
        {waypoint ? (
          <>
            <div>
              <label className="text-sm font-medium text-gray-500">
                역 이름
              </label>
              <div>{waypoint?.name}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                도착정보
              </label>
              {/* <div className="flex flex-col"> */}
              <ul className="flex flex-col">
                {data?.length > 0
                  ? data.map((item) => (
                      <li key={item.arvlMsg}>- {item.arvlMsg}</li>
                    ))
                  : "-"}
              </ul>
              {/* </div> */}
            </div>

            {data?.length > 0 ? (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  조회시간
                </label>
                <div className="flex flex-col text-xs font-medium text-gray-500">
                  {formatKoreanDateTime(data[0].recptnDt)}
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="flex gap-2 pt-4"></div>
          </>
        ) : (
          <span className="text-sm text-muted-foreground font-medium">
            역 이름을 클릭하면 도착정보를 찾을 수 있어요
          </span>
        )}
      </div>
    </div>
  );
};

export default WaypointPanel;
