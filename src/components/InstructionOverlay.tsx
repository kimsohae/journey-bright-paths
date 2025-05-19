
import React from 'react';
import { MapPin } from 'lucide-react';

interface InstructionOverlayProps {
  visible: boolean;
}

const InstructionOverlay: React.FC<InstructionOverlayProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-sm animate-fade-in z-10">
      <MapPin size={40} className="mx-auto mb-4 text-travel-purple" />
      <h2 className="text-xl font-bold mb-2">Create Your Travel Route</h2>
      <p className="text-muted-foreground">Click anywhere on the map to add waypoints and create your travel route.</p>
    </div>
  );
};

export default InstructionOverlay;
