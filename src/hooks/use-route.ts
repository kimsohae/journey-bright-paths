
import { useState, useEffect } from 'react';
import { 
  saveRoute, 
  createNewRoute, 
  getShareableUrl, 
  getRouteFromUrl 
} from '@/utils/routeUtils';
import { Waypoint } from '@/types/Position';


export interface Route {
  id: string;
  title: string;
  description: string;
  waypoints: Waypoint[];
  createdAt: string;
}

export function useRoute() {
  
  const [routeTitle, setRouteTitle] = useState('My Travel Route');
  const [routeDescription, setRouteDescription] = useState('');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [routeId, setRouteId] = useState<string>('');

  // Initialize route from URL or create new
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

  return {
    routeTitle,
    setRouteTitle,
    routeDescription,
    setRouteDescription,
    waypoints,
    selectedWaypoint,
    handleAddWaypoint,
    handleSelectWaypoint,
    handleUpdateWaypoint,
    handleDeleteWaypoint,
    handleSaveRoute,
    handleShareRoute,
  };
}
