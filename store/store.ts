import { configureStore } from "@reduxjs/toolkit";

import ManageConnectionsReducer from "../features/addConnection/redux/manageConnections";

export const store = configureStore({
  reducer: {
    connections: ManageConnectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
