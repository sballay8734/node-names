import { configureStore } from "@reduxjs/toolkit";

import ManageSelectionsReducer from "../features/manageSelections/redux/manageSelections";

export const store = configureStore({
  reducer: {
    selections: ManageSelectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
