import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface UiSliceState {
  popoverIsShown: boolean;
  sheetIsShown: boolean;
}

// Define the initial state using that type
const initialState: UiSliceState = {
  popoverIsShown: false,
  sheetIsShown: false,
};

const UiSlice = createSlice({
  name: "uiSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // use this to toggle ******************************************************
    handlePopover: (state) => {
      state.popoverIsShown = !state.popoverIsShown;
    },
    handleSheet: (state) => {
      state.sheetIsShown = !state.sheetIsShown;
    },
    // use these for other actions *********************************************
    showPopover: (state) => {
      state.popoverIsShown = true;
    },
    hidePopover: (state) => {
      state.popoverIsShown = false;
    },

    showSheet: (state) => {
      state.sheetIsShown = true;
    },
    hideSheet: (state) => {
      state.sheetIsShown = false;
    },
  },
});

export const {
  handlePopover,
  handleSheet,
  showPopover,
  hidePopover,
  showSheet,
  hideSheet,
} = UiSlice.actions;

export default UiSlice.reducer;
