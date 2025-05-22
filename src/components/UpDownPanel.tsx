import { memo } from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParam } from "@/context/SearchContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const UpDownPanel = memo(() => {
  const isMobile = useIsMobile();
  const { isUpShown, setIsUpShown } = useSearchParam();

  return (
    <div
      className={cn([
        `absolute flex gap-2 z-10 top-4 left-12 glass-card bg-white/70 backdrop-blur-md p-4 shadow-lg`,
        `${isMobile ? "left-4" : ""}`,
      ])}
    >
      <button
        className={`flex ${
          isUpShown ? "font-bold text-gray-900" : "text-gray-400 font-thin"
        }`}
        onClick={() => setIsUpShown(true)}
      >
        <ChevronDown className="rotate-180" /> 상행
      </button>
      <button
        className={`flex ${
          !isUpShown ? "font-bold text-gray-900" : "text-gray-400 font-thin"
        }`}
        onClick={() => setIsUpShown(false)}
      >
        <ChevronDown /> 하행
      </button>
    </div>
  );
});

export default UpDownPanel;
