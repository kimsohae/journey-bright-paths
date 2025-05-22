import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Waypoint } from "@/types/Position";
import { useGetRealtimeArrival } from "@/hooks/use-realtime-arrival";

interface MobilePanelProps {
  waypoint: Waypoint;
}

const MobilePanel: React.FC<MobilePanelProps> = ({ waypoint }) => {
  const { data } = useGetRealtimeArrival(encodeURIComponent(waypoint?.name));
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transition-all duration-300 z-10 h-fit"
      )}
    >
      <div className="p-4 flex flex-col justify-between ">
        <h2 className="font-bold text-travel-dark">지하철 도착 정보</h2>
        {waypoint ? (
          <div className="inline-block">
            <div>
              <div>{waypoint?.name}</div>
            </div>
            <div>
              <div className="flex flex-col text-sm">
                {data?.length > 0
                  ? data.map((item) => (
                      <span key={item.arvlMsg}>{item.arvlMsg}</span>
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
