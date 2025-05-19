
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Download, Share } from 'lucide-react';

interface HeaderProps {
  isMobile: boolean;
  onSave: () => void;
  onShare: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMobile, onSave, onShare }) => {
  return (
    <header className="bg-white/70 backdrop-blur-md p-4 shadow-sm z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-travel-dark flex items-center gap-2">
          <Navigation className="text-travel-purple" />
          Travel Route Planner
        </h1>
        
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={onSave}
              variant="outline"
              className="hidden md:flex"
            >
              <Download size={18} className="mr-2" /> Save Route
            </Button>
            <Button onClick={onShare}>
              <Share size={18} className="mr-2" /> Share Route
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
