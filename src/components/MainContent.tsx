import { useIsMobile } from "@/hooks/use-mobile";
import MapView from "@/components/MapView";
import MobilePanel from "@/components/InfoPanel/MobilePanel";
import DesktopPanel from "@/components/InfoPanel/DesktopPanel";

const MainContent: React.FC = ({}) => {
  const isMobile = useIsMobile();

  return (
    <main className="flex-grow flex relative overflow-hidden">
      {/* Map Area */}
      <div className="flex-grow relative">
        <MapView />
      </div>

      {/* Desktop: Sidebar */}
      {!isMobile && <DesktopPanel />}
      {/* Mobile: BottomSheet */}
      {isMobile && <MobilePanel />}
    </main>
  );
};

export default MainContent;
