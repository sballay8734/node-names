import { createSlice } from "@reduxjs/toolkit";

import { REDUX_ACTIONS } from "@/lib/constants/actions";

import { toggleNode } from "./graphSlice";

// Define a type for the slice state
interface UiSliceState {
  popoverIsShown: boolean;
}

// Define the initial state using that type
const initialState: UiSliceState = {
  popoverIsShown: false,
};

// CASES:
// createNewNode: always active unless selectedNodeIds is empty array
// createNewGroup: always active unless selectedNodeIds is empty array (UNLESS last set to active is of type group [cant add group FROM group])
// cSGFS: active if more than one node is selected AND root can't be selected AND no nodes with type of group can be selected
// moveNode: inactive if root is last set to active or if last active type is group

const UiSlice = createSlice({
  name: "uiSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // use this to toggle ******************************************************
    handlePopover: (state) => {
      state.popoverIsShown = !state.popoverIsShown;
    },
    // use these for other actions *********************************************
    showPopover: (state) => {
      state.popoverIsShown = true;
    },
    hidePopover: (state) => {
      state.popoverIsShown = false;
    },
  },
});

export const { handlePopover, showPopover, hidePopover } = UiSlice.actions;

export default UiSlice.reducer;
