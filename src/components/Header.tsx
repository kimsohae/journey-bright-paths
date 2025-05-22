import React from "react";
import { Button } from "@/components/ui/button";
import { Navigation, Download, Share, Route } from "lucide-react";

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
          <Route className="text-red-500" />
          분당분당
        </h1>
      </div>
    </header>
  );
};

export default Header;
