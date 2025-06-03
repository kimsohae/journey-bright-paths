import { Route } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header
      className={`bg-white/70 backdrop-blur-md shadow-sm py-4 z-10 ${
        isMobile ? "px-0" : "px-4"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-travel-dark flex items-center gap-2">
          <Route className="text-red-500" />
          분당분당
        </h1>
      </div>
    </header>
  );
}
