import { configureStore } from "@reduxjs/toolkit";

import windowSizeReducer from "@/features/Shared/redux/windowSize";

import NewArchitectureReducer from "../features/Graph/redux/graphDataManagement";
import ManageGraphReducer from "../features/Graph/redux/graphManagement";
import ManageSelectionsReducer from "../features/SelectionManagement/redux/manageSelections";

export const store = configureStore({
  reducer: {
    selections: ManageSelectionsReducer,
    manageGraph: ManageGraphReducer,
    windowSize: windowSizeReducer,
    graphData: NewArchitectureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
