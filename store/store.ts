import { configureStore } from "@reduxjs/toolkit";

import gesturesReducer from "@/features/Shared/redux/gestures";
import windowSizeReducer from "@/features/Shared/redux/windowSize";

import ManageGraphReducer from "../features/Graph/redux/graphManagement";
import ManageSelectionsReducer from "../features/SelectionManagement/redux/manageSelections";

export const store = configureStore({
  reducer: {
    selections: ManageSelectionsReducer,
    manageGraph: ManageGraphReducer,
    gestures: gesturesReducer,
    windowSize: windowSizeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
