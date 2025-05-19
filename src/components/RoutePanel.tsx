
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Share, Download, MapPin, Navigation, Route } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

interface Waypoint {
  id: string;
  longitude: number;
  latitude: number;
  name?: string;
  description?: string;
  imageUrl?: string;
}

interface RoutePanelProps {
  title: string;
  description: string;
  waypoints: Waypoint[];
  onTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
  onWaypointSelect: (waypoint: Waypoint) => void;
  onSave: () => void;
  onShare: () => void;
}

const RoutePanel: React.FC<RoutePanelProps> = ({
  title,
  description,
  waypoints,
  onTitleChange,
  onDescriptionChange,
  onWaypointSelect,
  onSave,
  onShare
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave();
    setIsEditing(false);
    toast.success('Route saved!');
  };

  const handleShare = () => {
    onShare();
    toast.success('Route link copied to clipboard!');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {isEditing ? (
        <div className="glass-card p-4 space-y-4">
          <h3 className="text-lg font-semibold">Edit Route</h3>
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Route title"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe your route"
              className="mt-1 h-24 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              className="flex-1"
            >
              Save
            </Button>
            <Button 
              onClick={() => setIsEditing(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Card className="bg-travel-lightPurple/50 border-travel-purple/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{title || "New Travel Route"}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {description || "Click edit to add a description for your travel route."}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleShare}
                variant="default"
                className="flex-1"
              >
                <Share className="mr-2" size={16} /> Share
              </Button>
              <Button 
                variant="outline"
                onClick={handleSave}
              >
                <Download className="mr-2" size={16} /> Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="glass-card p-4 animate-fade-in">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Route size={16} /> Waypoints ({waypoints.length})
        </h3>
        
        {waypoints.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Click on the map to add waypoints to your route
          </div>
        ) : (
          <div className="space-y-2 mt-3 max-h-[240px] overflow-y-auto pr-2">
            {waypoints.map((waypoint, index) => (
              <div 
                key={waypoint.id}
                onClick={() => onWaypointSelect(waypoint)}
                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
              >
                <div className="bg-travel-purple/10 w-8 h-8 rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-travel-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {waypoint.name || `Waypoint ${index + 1}`}
                  </div>
                  {waypoint.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {waypoint.description}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePanel;
