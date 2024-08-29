import { configureStore } from "@reduxjs/toolkit";

import windowSizeReducer from "@/features/Graph/redux/windowSize";

import NewArchitectureReducer from "../features/Graph/redux/graphDataManagement";
import ManageSelectionsReducer from "../features/Graph/redux/uiManagement";

export const store = configureStore({
  reducer: {
    selections: ManageSelectionsReducer,
    windowSize: windowSizeReducer,
    graphData: NewArchitectureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
