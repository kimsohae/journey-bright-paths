import { SubwayNm } from "@/types/Position";
import React, { createContext, useContext, useState } from "react";

export interface SearchParam {
  isUpShown: boolean;
  subwayNm: SubwayNm;
  statn: {
    id: string;
    name: string;
  } | null;
}

const ValueContext = createContext<SearchParam | null>(null);
const ActionContext = createContext<
  ((param: Partial<SearchParam>) => void) | null
>(null);

export const SearchParamProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParams, setSearchParams] = useState<SearchParam>({
    isUpShown: true,
    subwayNm: "newBundang",
    statn: null,
  });

  const updateParams = (param: Partial<SearchParam>) => {
    setSearchParams((prev) => ({ ...prev, ...param }));
  };

  return (
    <ValueContext.Provider value={searchParams}>
      <ActionContext.Provider value={updateParams}>
        {children}
      </ActionContext.Provider>
    </ValueContext.Provider>
  );
};

export const useParamValue = () => {
  const context = useContext(ValueContext);

  if (context === null) {
    throw new Error("useParamValue should be used within Provider");
  }
  return context;
};

export const useParamAction = () => {
  const context = useContext(ActionContext);

  if (context === null) {
    throw new Error("useParamAction should be used within Provider");
  }
  return context;
};
