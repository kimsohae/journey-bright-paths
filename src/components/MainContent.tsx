import { useIsMobile } from "@/hooks/useIsMobile";
import MapView from "@/components/MapView";
import MobilePanel from "@/components/infoPanel/mobile/MobilePanel";
import DesktopPanel from "@/components/infoPanel/desktop/DesktopPanel";

export default function MainContent() {
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
}
