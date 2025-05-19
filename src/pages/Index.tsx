
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Share, Navigation, Download, MapPin, Image } from 'lucide-react';
import MapView from '@/components/MapView';
import WaypointPanel from '@/components/WaypointPanel';
import RoutePanel from '@/components/RoutePanel';
import MobilePanel from '@/components/MobilePanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { saveRoute, createNewRoute, getShareableUrl, getRouteFromUrl } from '@/utils/routeUtils';

interface Waypoint {
  id: string;
  longitude: number;
  latitude: number;
  name?: string;
  description?: string;
  imageUrl?: string;
}

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Route state
  const [routeTitle, setRouteTitle] = useState('My Travel Route');
  const [routeDescription, setRouteDescription] = useState('');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [routeId, setRouteId] = useState<string>('');

  // Check for shared route in URL
  useEffect(() => {
    const sharedRoute = getRouteFromUrl();
    if (sharedRoute) {
      setRouteId(sharedRoute.id);
      setRouteTitle(sharedRoute.title);
      setRouteDescription(sharedRoute.description);
      setWaypoints(sharedRoute.waypoints);
      toast({
        title: 'Shared Route Loaded',
        description: `Loaded route: ${sharedRoute.title}`,
      });
    } else {
      // Initialize a new route if none is shared
      const newRoute = createNewRoute();
      setRouteId(newRoute.id);
    }
  }, []);

  const handleAddWaypoint = (waypoint: Waypoint) => {
    setWaypoints([...waypoints, waypoint]);
    setSelectedWaypoint(waypoint);
  };

  const handleSelectWaypoint = (waypoint: Waypoint | null) => {
    setSelectedWaypoint(waypoint);
  };

  const handleUpdateWaypoint = (updatedWaypoint: Waypoint) => {
    setWaypoints(
      waypoints.map((wp) => wp.id === updatedWaypoint.id ? updatedWaypoint : wp)
    );
    setSelectedWaypoint(updatedWaypoint);
  };

  const handleDeleteWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id));
    setSelectedWaypoint(null);
  };

  const handleSaveRoute = () => {
    const route = {
      id: routeId,
      title: routeTitle,
      description: routeDescription,
      waypoints,
      createdAt: new Date().toISOString(),
    };
    
    saveRoute(route);
    
    toast({
      title: 'Route Saved',
      description: 'Your route has been saved successfully.',
    });
  };

  const handleShareRoute = () => {
    const route = {
      id: routeId,
      title: routeTitle,
      description: routeDescription,
      waypoints,
      createdAt: new Date().toISOString(),
    };
    
    const shareUrl = getShareableUrl(route);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast({
          title: 'Link Copied!',
          description: 'Share link has been copied to your clipboard.',
        });
      },
      (err) => {
        console.error('Could not copy link: ', err);
        toast({
          variant: 'destructive',
          title: 'Failed to Copy',
          description: 'There was an error copying the link.',
        });
      }
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col gradient-bg">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md p-4 shadow-sm z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-travel-dark flex items-center gap-2">
            <Navigation className="text-travel-purple" />
            Travel Route Planner
          </h1>
          
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleSaveRoute}
                variant="outline"
                className="hidden md:flex"
              >
                <Download size={18} className="mr-2" /> Save Route
              </Button>
              <Button onClick={handleShareRoute}>
                <Share size={18} className="mr-2" /> Share Route
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex relative overflow-hidden">
        {/* Map Area */}
        <div className="flex-grow">
          <MapView 
            waypoints={waypoints}
            onWaypointAdd={handleAddWaypoint}
            onWaypointSelect={handleSelectWaypoint}
            selectedWaypoint={selectedWaypoint}
          />
        </div>
        
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 bg-white/70 backdrop-blur-md p-4 shadow-lg overflow-y-auto">
            {selectedWaypoint ? (
              <WaypointPanel
                waypoint={selectedWaypoint}
                onUpdate={handleUpdateWaypoint}
                onDelete={handleDeleteWaypoint}
                onClose={() => setSelectedWaypoint(null)}
              />
            ) : (
              <RoutePanel
                title={routeTitle}
                description={routeDescription}
                waypoints={waypoints}
                onTitleChange={setRouteTitle}
                onDescriptionChange={setRouteDescription}
                onWaypointSelect={handleSelectWaypoint}
                onSave={handleSaveRoute}
                onShare={handleShareRoute}
              />
            )}
          </div>
        )}
        
        {/* Mobile Panel */}
        {isMobile && (
          <MobilePanel
            waypoints={waypoints}
            selectedWaypoint={selectedWaypoint}
            onWaypointSelect={handleSelectWaypoint}
            onWaypointUpdate={handleUpdateWaypoint}
            onWaypointDelete={handleDeleteWaypoint}
            routeTitle={routeTitle}
            routeDescription={routeDescription}
            onTitleChange={setRouteTitle}
            onDescriptionChange={setRouteDescription}
            onSave={handleSaveRoute}
            onShare={handleShareRoute}
          />
        )}
        
        {/* Instruction Overlay (only shown when no waypoints) */}
        {waypoints.length === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-sm animate-fade-in">
            <MapPin size={40} className="mx-auto mb-4 text-travel-purple" />
            <h2 className="text-xl font-bold mb-2">Create Your Travel Route</h2>
            <p className="text-muted-foreground">Click anywhere on the map to add waypoints and create your travel route.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
