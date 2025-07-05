import { ViewState } from "react-map-gl";
import { create } from "zustand";

type ViewStateStore = {
  viewState: ViewState;
  updateViewState: (param: ViewState) => void;
};

export const useViewStateStore = create<ViewStateStore>((set) => ({
  viewState: null,
  updateViewState: (param: ViewState) =>
    set((state) => ({ viewState: { ...state.viewState, ...param } })),
}));
