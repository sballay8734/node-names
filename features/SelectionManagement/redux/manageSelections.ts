import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { RelationshipType } from "@/types/dbTypes";
import { IPositionedNode } from "@/utils/getNodePositions";

interface IConnectionsAndNodes {
  connections: {
    [id: number]: {
      id: number;
      created_at: string;
      person_1_id: number;
      person_2_id: number;
      relationship_type: RelationshipType;
    };
  };
  nodes: {
    [id: number]: IPositionedNode;
  };
  connectionIds: number[];
  nodeIds: number[];
}

// Define a type for the slice state
interface ManageSelectionsState {
  secondaryConnections: { [nodeId: number]: IConnectionsAndNodes };

  popoverIsShown: boolean;
  selectedNodes: IPositionedNode[];
}

// Define the initial state using that type
const initialState: ManageSelectionsState = {
  secondaryConnections: {},

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

    setSecondary: (
      state,
      action: PayloadAction<{ [nodeId: number]: IConnectionsAndNodes }>,
    ) => {
      state.secondaryConnections = action.payload;
    },

    // SELECTION MANAGEMENT ****************************************************
    handleNodeSelect: (state, action: PayloadAction<IPositionedNode>) => {
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
  setSecondary,
} = ManageSelectionsSlice.actions;

export default ManageSelectionsSlice.reducer;
