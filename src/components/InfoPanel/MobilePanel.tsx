import { cn } from "@/lib/utils";
import ArrivalInformation from "./ArrivalInformation";

const MobilePanel: React.FC = () => {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transition-all duration-300 z-10 h-fit"
      )}
    >
      <div className="p-4 flex flex-col justify-between ">
        <h2 className="font-bold text-travel-dark">지하철 도착 정보</h2>
        <ArrivalInformation />
      </div>
    </div>
  );
};

export default MobilePanel;
