import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  PositionedLink,
  PositionedPerson,
} from "@/utils/positionGraphElements";

// Define a type for the slice state
interface ManageSelectionsState {
  userNodes: PositionedPerson[] | null;
  userLinks: PositionedLink[] | null;

  inspectedNodes: PositionedPerson[] | null;
  inspectedLinks: PositionedLink[] | null;

  popoverIsShown: boolean;
  selectedNodes: PositionedPerson[];
}

// Define the initial state using that type
const initialState: ManageSelectionsState = {
  userNodes: null,
  userLinks: null,

  inspectedNodes: null,
  inspectedLinks: null,

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

    setNodes: (state, action: PayloadAction<PositionedPerson[]>) => {
      state.userNodes = action.payload;
    },
    setLinks: (state, action: PayloadAction<PositionedLink[]>) => {
      state.userLinks = action.payload;
    },

    // SELECTION MANAGEMENT ****************************************************
    handleNodeSelect: (state, action: PayloadAction<PositionedPerson>) => {
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

    // LINK MANAGEMENT/CREATION
    // creates a single, unconnected node
    handleCreateNewNode: (state) => {
      state.userNodes &&
        state.userNodes.push({
          created_at: "blah",
          first_name: "David",
          group_id: null,
          id: 328927,
          isRoot: false,
          last_name: "Johnson",
          maiden_name: null,
          phonetic_name: null,
          sex: "male",
          x: 250,
          y: 250,
        });
    },

    // creates a new link & node FROM currently selected node
    handleConnectToNewNode: (state, action) => {
      console.log("STARTING");
    },
  },
});

export const {
  handlePopover,
  setNodes,
  setLinks,
  showPopover,
  hidePopover,
  handleNodeSelect,
  handleConnectToNewNode,
  handleCreateNewNode,
} = ManageSelectionsSlice.actions;

export default ManageSelectionsSlice.reducer;
