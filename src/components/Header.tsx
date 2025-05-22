import React from "react";
import { Route } from "lucide-react";

const Header: React.FC = () => {
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
