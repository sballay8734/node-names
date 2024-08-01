import { configureStore } from "@reduxjs/toolkit";

import ManageGraphReducer from "../features/Graph/redux/graphManagement";
import ManageSelectionsReducer from "../features/SelectionManagement/redux/manageSelections";

export const store = configureStore({
  reducer: {
    selections: ManageSelectionsReducer,
    manageGraph: ManageGraphReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
