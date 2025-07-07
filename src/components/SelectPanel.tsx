import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { useSearchParamStore } from "@/store/SearchContext";

const SelectPanel = () => {
  const isMobile = useIsMobile();
  const { isUpShown, subwayNm, is2D } = useSearchParamStore(
    (state) => state.searchParams
  );
  const updateParams = useSearchParamStore((state) => state.updateParams);
  return (
    <div
      className={cn([
        `absolute flex flex-col gap-2 z-10 top-4 left-12 glass-card bg-white/70 backdrop-blur-md p-4 shadow-lg`,
        `${isMobile ? "left-4" : ""}`,
      ])}
    >
      <div className="flex gap-2">
        <button
          className={`flex items-center ${
            subwayNm === "newBundang"
              ? "font-bold text-gray-900"
              : "text-gray-400 font-thin"
          }`}
          onClick={() => updateParams({ subwayNm: "newBundang" })}
        >
          <div className="w-4 h-4 mr-1 rounded-full bg-newBundang" /> 신분당선
        </button>
        <button
          className={`flex items-center ${
            subwayNm === "bundang"
              ? "font-bold text-gray-900"
              : "text-gray-400 font-thin"
          }`}
          onClick={() => updateParams({ subwayNm: "bundang" })}
        >
          <div className="w-4 h-4 mr-1 rounded-full bg-bundang" /> 수인분당선
        </button>
      </div>
      <div className="h-px bg-gray-200" />
      <div className="flex gap-2 ">
        <button
          className={`flex ${
            isUpShown ? "font-bold text-gray-900" : "text-gray-400 font-thin"
          }`}
          onClick={() => updateParams({ isUpShown: true })}
        >
          <ChevronDown className="rotate-180" /> 상행
        </button>
        <button
          className={`flex ${
            !isUpShown ? "font-bold text-gray-900" : "text-gray-400 font-thin"
          }`}
          onClick={() => updateParams({ isUpShown: false })}
        >
          <ChevronDown /> 하행
        </button>
        {subwayNm === "newBundang" && (
          <div
            role="button"
            className={`flex text-gray-600 gap-1 justify-center ml-2`}
            onClick={() => updateParams({ is2D: !is2D })}
          >
            3D
            <Switch checked={!is2D}>3D</Switch>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectPanel;
