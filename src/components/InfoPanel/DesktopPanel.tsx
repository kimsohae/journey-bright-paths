import ArrivalInformation from "./ArrivalInformation";

const DesktopPanel = () => {
  return (
    <div className="w-80 bg-white/70 backdrop-blur-md p-4 shadow-lg overflow-y-auto flex flex-col justify-between">
      <div className="glass-card p-4 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">지하철 도착 정보</h3>
        </div>
        <div className="space-y-4">
          <ArrivalInformation />
        </div>
      </div>
      <div className="flex flex-col gap-1 text-xs text-gray-400/80 text-center">
        <span>지하철 위치 정보는 30초마다 갱신됩니다.</span>
        <a
          href="https://github.com/kimsohae/journey-bright-paths"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full justify-center gap-1 text-gray-800"
        >
          <img src="/github.webp" alt="github" width={16} height={16} />
          Github
        </a>
      </div>
    </div>
  );
};

export default DesktopPanel;
