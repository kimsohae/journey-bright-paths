
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, MapPin, Route, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import WaypointPanel from './WaypointPanel';
import RoutePanel from './RoutePanel';

interface Waypoint {
  id: string;
  longitude: number;
  latitude: number;
  name?: string;
  description?: string;
  imageUrl?: string;
}

interface MobilePanelProps {
  waypoints: Waypoint[];
  selectedWaypoint: Waypoint | null;
  onWaypointSelect: (waypoint: Waypoint) => void;
  onWaypointUpdate: (waypoint: Waypoint) => void;
  onWaypointDelete: (id: string) => void;
  routeTitle: string;
  routeDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
  onSave: () => void;
  onShare: () => void;
}

const MobilePanel: React.FC<MobilePanelProps> = ({
  waypoints,
  selectedWaypoint,
  onWaypointSelect,
  onWaypointUpdate,
  onWaypointDelete,
  routeTitle,
  routeDescription,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onShare
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'route' | 'waypoint'>(selectedWaypoint ? 'waypoint' : 'route');

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // When a waypoint is selected, show the waypoint panel and expand if collapsed
  React.useEffect(() => {
    if (selectedWaypoint) {
      setActiveTab('waypoint');
      if (!expanded) {
        setExpanded(true);
      }
    } else {
      setActiveTab('route');
    }
  }, [selectedWaypoint]);

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transition-all duration-300 z-10",
        expanded ? "h-[85vh]" : "h-24"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-travel-dark">
            {selectedWaypoint ? 'Waypoint Details' : (routeTitle || 'My Travel Route')}
          </h2>
          <p className="text-xs text-muted-foreground">
            {waypoints.length} waypoints
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleExpanded}
          aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
        >
          {expanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </Button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 overflow-y-auto h-[calc(85vh-6rem)]">
          <div className="flex mb-4 border-b">
            <Button 
              variant="ghost" 
              className={cn(
                "flex-1 rounded-none border-b-2 border-transparent",
                activeTab === 'route' && "border-travel-purple text-travel-purple"
              )}
              onClick={() => setActiveTab('route')}
            >
              <Route size={16} className="mr-2" /> Route
            </Button>
            <Button 
              variant="ghost" 
              className={cn(
                "flex-1 rounded-none border-b-2 border-transparent",
                activeTab === 'waypoint' && "border-travel-purple text-travel-purple"
              )}
              onClick={() => setActiveTab('waypoint')}
              disabled={!selectedWaypoint}
            >
              <MapPin size={16} className="mr-2" /> Waypoint
            </Button>
          </div>

          {activeTab === 'route' && (
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

          {activeTab === 'waypoint' && selectedWaypoint && (
            <WaypointPanel 
              waypoint={selectedWaypoint}
              onUpdate={onWaypointUpdate}
              onDelete={onWaypointDelete}
              onClose={() => onWaypointSelect(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MobilePanel;
