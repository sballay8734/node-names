import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { INode, ILink } from "@/features/D3/types/d3Types";
import { IConnectionsAndNodes } from "@/features/Graph/utils/getNodeConnections";

// Define a type for the slice state
interface ManageSelectionsState {
  primaryNodes: INode[] | null;
  primaryLinks: ILink[] | null;

  secondaryConnections: { [nodeId: number]: IConnectionsAndNodes };

  inspectedNodes: INode[] | null;
  inspectedLinks: ILink[] | null;

  popoverIsShown: boolean;
  selectedNodes: INode[];
}

// Define the initial state using that type
const initialState: ManageSelectionsState = {
  primaryNodes: null,
  primaryLinks: null,

  secondaryConnections: {},

  inspectedNodes: null,
  inspectedLinks: null,

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

    setNodes: (state, action: PayloadAction<INode[]>) => {
      state.primaryNodes = action.payload;
    },
    setLinks: (state, action: PayloadAction<ILink[]>) => {
      state.primaryLinks = action.payload;
    },
    setSecondary: (
      state,
      action: PayloadAction<{ [nodeId: number]: IConnectionsAndNodes }>,
    ) => {
      state.secondaryConnections = action.payload;
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

    deselectAll: (state) => {
      state.selectedNodes = [];
    },

    // LINK MANAGEMENT/CREATION
    // creates a single, unconnected node
    handleCreateNewNode: (state) => {
      state.primaryNodes &&
        state.primaryNodes.push({
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
  deselectAll,
  setSecondary,
} = ManageSelectionsSlice.actions;

export default ManageSelectionsSlice.reducer;
