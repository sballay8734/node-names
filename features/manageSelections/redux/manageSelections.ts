import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ManageSelectionsState {
  value: number;
}

// Define the initial state using that type
const initialState: ManageSelectionsState = {
  value: 0,
};

export const ManageSelectionsSlice = createSlice({
  name: "manageSelections",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } =
  ManageSelectionsSlice.actions;

export default ManageSelectionsSlice.reducer;
