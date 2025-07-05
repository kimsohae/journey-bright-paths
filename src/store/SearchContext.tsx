import { create } from "zustand";

interface SearchParam {
  isUpShown: boolean;
  is2D: boolean;
  subwayNm: "newBundang" | "bundang";
  statn: { id: string; name: string } | null;
}

type SearchParamStore = {
  searchParams: SearchParam;
  updateParams: (param: Partial<SearchParam>) => void;
};

export const useSearchParamStore = create<SearchParamStore>((set) => ({
  searchParams: {
    isUpShown: true,
    is2D: true,
    subwayNm: "newBundang",
    statn: null,
  },
  updateParams: (param: Partial<SearchParam>) =>
    set((state) => ({ searchParams: { ...state.searchParams, ...param } })),
}));
