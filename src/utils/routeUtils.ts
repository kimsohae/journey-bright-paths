
import * as turf from '@turf/turf';
import { v4 as uuidv4 } from 'uuid';

interface Waypoint {
  id: string;
  longitude: number;
  latitude: number;
  name?: string;
  description?: string;
  imageUrl?: string;
}

interface RouteData {
  id: string;
  title: string;
  description: string;
  waypoints: Waypoint[];
  createdAt: string;
}

// Calculate approximate travel time between two points (in minutes)
export const calculateTravelTime = (from: Waypoint, to: Waypoint): number => {
  // Create GeoJSON points
  const fromPoint = turf.point([from.longitude, from.latitude]);
  const toPoint = turf.point([to.longitude, to.latitude]);
  
  // Calculate distance in kilometers
  const distance = turf.distance(fromPoint, toPoint);
  
  // Assume average speed of 40 km/h for urban travel
  // This is a very rough estimation - in a real app, you'd use a routing API
  const averageSpeed = 40; // km/h
  
  // Calculate time in minutes
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = timeInHours * 60;
  
  return Math.round(timeInMinutes);
};

// Format the time in a user-friendly way
export const formatTravelTime = (minutes: number): string => {
  if (minutes < 1) {
    return 'Less than a minute';
  }
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

// Create a new route
export const createNewRoute = (): RouteData => {
  return {
    id: uuidv4(),
    title: 'New Travel Route',
    description: '',
    waypoints: [],
    createdAt: new Date().toISOString(),
  };
};

// Save route to local storage
export const saveRoute = (route: RouteData): void => {
  // Get existing routes or initialize empty array
  const existingRoutesStr = localStorage.getItem('travelRoutes');
  const existingRoutes: RouteData[] = existingRoutesStr ? JSON.parse(existingRoutesStr) : [];
  
  // Check if route already exists
  const routeIndex = existingRoutes.findIndex(r => r.id === route.id);
  
  if (routeIndex >= 0) {
    // Update existing route
    existingRoutes[routeIndex] = route;
  } else {
    // Add new route
    existingRoutes.push(route);
  }
  
  // Save back to local storage
  localStorage.setItem('travelRoutes', JSON.stringify(existingRoutes));
};

// Generate shareable URL for a route
export const getShareableUrl = (route: RouteData): string => {
  // In a real app, this might generate a proper short URL or use a backend service
  // For now, we'll just encode the route data in a URL parameter
  const baseUrl = window.location.origin;
  const routeParam = encodeURIComponent(JSON.stringify(route));
  
  return `${baseUrl}?route=${routeParam}`;
};

// Extract route from URL if present
export const getRouteFromUrl = (): RouteData | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const routeParam = urlParams.get('route');
  
  if (!routeParam) {
    return null;
  }
  
  try {
    return JSON.parse(decodeURIComponent(routeParam));
  } catch (error) {
    console.error('Failed to parse route from URL', error);
    return null;
  }
};
