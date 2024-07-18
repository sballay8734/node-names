import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { INode } from "@/features/graph/types/graphTypes";

// Define a type for the slice state
interface ManageSelectionsState {
  popoverIsShown: boolean;
  selectedNodes: INode[];
}

// Define the initial state using that type
const initialState: ManageSelectionsState = {
  popoverIsShown: false,
  selectedNodes: [],
};

export const ManageSelectionsSlice = createSlice({
  name: "manageSelections",
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

    // SELECTION MANAGEMENT ****************************************************
    handleNodeSelect: (state, action: PayloadAction<INode>) => {
      const clickedNode = action.payload;
      const nodeIndex = state.selectedNodes.findIndex(
        (node) => node.id === clickedNode.id,
      );

      // if we found it, it's already in array so this click should remove it
      if (nodeIndex > -1) {
        state.selectedNodes = state.selectedNodes.filter(
          (node) => node.id !== clickedNode.id,
        );
      } else {
        // if we didn't find it, then just add it to the array
        state.selectedNodes = [...state.selectedNodes, clickedNode];
      }
    },
  },
});

export const { handlePopover, showPopover, hidePopover, handleNodeSelect } =
  ManageSelectionsSlice.actions;

export default ManageSelectionsSlice.reducer;
