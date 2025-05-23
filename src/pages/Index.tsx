import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import { ErrorBoundary } from "react-error-boundary";

const Index: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col gradient-bg">
      <Header />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MainContent />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
