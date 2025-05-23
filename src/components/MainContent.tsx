import { useIsMobile } from "@/hooks/use-mobile";
import { Waypoint } from "@/types/Position";
import MapView from "@/components/MapView";
import WaypointPanel from "@/components/WaypointPanel";
import MobilePanel from "@/components/MobilePanel";
import { ErrorBoundary } from "react-error-boundary";

interface MainContentProps {
  selectedWaypoint: Waypoint | null;
  onWaypointAdd: (waypoint: Waypoint) => void;
  onWaypointSelect: (waypoint: Waypoint | null) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedWaypoint,
  onWaypointSelect,
}) => {
  const isMobile = useIsMobile();

  return (
    <main className="flex-grow flex relative overflow-hidden">
      {/* Map Area */}
      <div className="flex-grow relative">
        <MapView
          onWaypointSelect={onWaypointSelect}
          selectedWaypoint={selectedWaypoint}
        />
      </div>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-80 bg-white/70 backdrop-blur-md p-4 shadow-lg overflow-y-auto flex flex-col justify-between">
          <WaypointPanel waypoint={selectedWaypoint} />
          <span className="text-xs text-gray-400/80 text-center">
            지하철 위치 정보는 30초마다 갱신됩니다.
          </span>
        </div>
      )}

      {/* Mobile Panel */}
      {isMobile && <MobilePanel waypoint={selectedWaypoint} />}
    </main>
  );
};

export default MainContent;
