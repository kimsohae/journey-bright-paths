
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRoute } from '@/hooks/use-route';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';

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
      
      <MainContent 
        waypoints={route.waypoints}
        selectedWaypoint={route.selectedWaypoint}
        routeTitle={route.routeTitle}
        routeDescription={route.routeDescription}
        onWaypointAdd={route.handleAddWaypoint}
        onWaypointSelect={route.handleSelectWaypoint}
        onWaypointUpdate={route.handleUpdateWaypoint}
        onWaypointDelete={route.handleDeleteWaypoint}
        onTitleChange={route.setRouteTitle}
        onDescriptionChange={route.setRouteDescription}
        onSave={route.handleSaveRoute}
        onShare={route.handleShareRoute}
      />
    </div>
  );
};

export default Index;
