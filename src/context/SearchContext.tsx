import React, { createContext, useContext, useState } from "react";

const SearchParamContext = createContext<{
  isUpShown: boolean;
  setIsUpShown: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const SearchParamProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isUpShown, setIsUpShown] = useState<boolean>(true);

  return (
    <SearchParamContext.Provider value={{ isUpShown, setIsUpShown }}>
      {children}
    </SearchParamContext.Provider>
  );
};

export const useSearchParam = () => {
  const context = useContext(SearchParamContext);
  if (context === null) {
    throw new Error("useSearchParam should be used within Provider");
  }
  return context;
};
