import { configureStore } from "@reduxjs/toolkit";

import windowSizeReducer from "@/features/Graph/redux/windowSize";

import NewArchitectureReducer from "../features/Graph/redux/graphSlice";
import UiSliceReducer from "../features/Graph/redux/uiSlice";

export const store = configureStore({
  reducer: {
    ui: UiSliceReducer,
    windowSize: windowSizeReducer,
    graphData: NewArchitectureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
