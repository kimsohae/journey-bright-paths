
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from '@/components/MapView';
import WaypointPanel from '@/components/WaypointPanel';
import RoutePanel from '@/components/RoutePanel';
import MobilePanel from '@/components/MobilePanel';
import InstructionOverlay from '@/components/InstructionOverlay';
import { Waypoint } from '@/hooks/use-route';

interface MainContentProps {
  waypoints: Waypoint[];
  selectedWaypoint: Waypoint | null;
  routeTitle: string;
  routeDescription: string;
  onWaypointAdd: (waypoint: Waypoint) => void;
  onWaypointSelect: (waypoint: Waypoint | null) => void;
  onWaypointUpdate: (waypoint: Waypoint) => void;
  onWaypointDelete: (id: string) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onShare: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  waypoints,
  selectedWaypoint,
  routeTitle,
  routeDescription,
  onWaypointAdd,
  onWaypointSelect,
  onWaypointUpdate,
  onWaypointDelete,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onShare
}) => {
  const isMobile = useIsMobile();

  return (
    <main className="flex-grow flex relative overflow-hidden">
      {/* Map Area */}
      <div className="flex-grow">
        <MapView 
          waypoints={waypoints}
          onWaypointAdd={onWaypointAdd}
          onWaypointSelect={onWaypointSelect}
          selectedWaypoint={selectedWaypoint}
        />
      </div>
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-80 bg-white/70 backdrop-blur-md p-4 shadow-lg overflow-y-auto">
          {selectedWaypoint ? (
            <WaypointPanel
              waypoint={selectedWaypoint}
              onUpdate={onWaypointUpdate}
              onDelete={onWaypointDelete}
              onClose={() => onWaypointSelect(null)}
            />
          ) : (
            <RoutePanel
              title={routeTitle}
              description={routeDescription}
              waypoints={waypoints}
              onTitleChange={onTitleChange}
              onDescriptionChange={onDescriptionChange}
              onWaypointSelect={onWaypointSelect}
              onSave={onSave}
              onShare={onShare}
            />
          )}
        </div>
      )}
      
      {/* Mobile Panel */}
      {isMobile && (
        <MobilePanel
          waypoints={waypoints}
          selectedWaypoint={selectedWaypoint}
          onWaypointSelect={onWaypointSelect}
          onWaypointUpdate={onWaypointUpdate}
          onWaypointDelete={onWaypointDelete}
          routeTitle={routeTitle}
          routeDescription={routeDescription}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onSave={onSave}
          onShare={onShare}
        />
      )}
      
      {/* Instruction Overlay (only shown when no waypoints) */}
      <InstructionOverlay visible={waypoints.length === 0} />
    </main>
  );
};

export default MainContent;
