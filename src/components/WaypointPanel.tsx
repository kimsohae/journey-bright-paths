
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface Waypoint {
  id: string;
  longitude: number;
  latitude: number;
  name?: string;
  description?: string;
  imageUrl?: string;
}

interface WaypointPanelProps {
  waypoint: Waypoint | null;
  onUpdate: (waypoint: Waypoint) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const WaypointPanel: React.FC<WaypointPanelProps> = ({ 
  waypoint, 
  onUpdate, 
  onDelete, 
  onClose 
}) => {
  const [name, setName] = useState(waypoint?.name || '');
  const [description, setDescription] = useState(waypoint?.description || '');
  const [image, setImage] = useState<string | null>(waypoint?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!waypoint) return null;

  const handleSave = () => {
    if (waypoint) {
      onUpdate({
        ...waypoint,
        name,
        description,
        imageUrl: image || undefined
      });
      toast.success('Waypoint updated');
    }
  };

  const handleDelete = () => {
    if (waypoint) {
      onDelete(waypoint.id);
      onClose();
      toast.success('Waypoint deleted');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-card p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Waypoint Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter waypoint name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Describe this location"
            className="h-24 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Photo</label>
          <div className="mt-2 relative">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Waypoint" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2"
                  onClick={() => setImage(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-24 flex flex-col" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={24} />
                <span className="mt-2 text-xs">Add Photo</span>
              </Button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSave} 
            className="flex-1"
            variant="default"
          >
            Save
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Navigation size={12} /> 
          {waypoint.longitude.toFixed(4)}, {waypoint.latitude.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default WaypointPanel;
