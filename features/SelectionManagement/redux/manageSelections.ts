import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ManageSelectionsState {
  popoverIsShown: boolean;
  selectedNodes: number[];
}

// Define the initial state using that type
const initialState: ManageSelectionsState = {
  popoverIsShown: false,
  selectedNodes: [],
};

const ManageSelectionsSlice = createSlice({
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
    handleNodeSelect: (state, action: PayloadAction<number>) => {
      const clickedNodeId = action.payload;
      const nodeIndex = state.selectedNodes.indexOf(clickedNodeId);

      if (nodeIndex > -1) {
        // If the ID is already in the array, remove it
        state.selectedNodes = state.selectedNodes.filter(
          (id) => id !== clickedNodeId,
        );
      } else {
        // If the ID is not in the array, add it
        state.selectedNodes = [...state.selectedNodes, clickedNodeId];
      }
    },

    deselectAll: (state) => {
      state.selectedNodes = [];
    },

    // LINK MANAGEMENT/CREATION

    // creates a new link & node FROM currently selected node
    handleConnectToNewNode: (state, action) => {
      console.log("STARTING");
    },
  },
});

export const {
  handlePopover,
  showPopover,
  hidePopover,
  handleNodeSelect,
  handleConnectToNewNode,
  deselectAll,
} = ManageSelectionsSlice.actions;

export default ManageSelectionsSlice.reducer;
