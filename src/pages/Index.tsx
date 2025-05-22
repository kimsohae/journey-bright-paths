import { useIsMobile } from "@/hooks/use-mobile";
import { useRoute } from "@/hooks/use-route";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import { ErrorBoundary } from "react-error-boundary";

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const route = useRoute();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col gradient-bg">
      <Header
        isMobile={isMobile}
        onSave={route.handleSaveRoute}
        onShare={route.handleShareRoute}
      />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MainContent
          selectedWaypoint={route.selectedWaypoint}
          onWaypointAdd={route.handleAddWaypoint}
          onWaypointSelect={route.handleSelectWaypoint}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
