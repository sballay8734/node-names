import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PositionedLink } from "@/features/D3/types/d3Types";

import { INode2 } from "../types/graphManagementTypes";
import { NodeHashObj } from "../utils/getInitialNodes";

interface ManageGraphState {
  userNode: INode2 | null;
  activeRootNode: INode2 | null;

  globalNodesHash: { [x: number]: NodeHashObj };
  userLinks: PositionedLink[];
}

const initialState: ManageGraphState = {
  userNode: null,
  activeRootNode: null,

  globalNodesHash: {},
  userLinks: [],
};

const ManageGraphSlice = createSlice({
  name: "manageGraph",
  initialState,
  reducers: {
    setActiveRootNode: (state, action: PayloadAction<INode2>) => {
      state.activeRootNode = {
        ...action.payload,
      };
    },
    setUserNode: (state, action: PayloadAction<INode2>) => {
      state.userNode = action.payload;
    },
    setUserNodes: (
      state,
      action: PayloadAction<{ [x: number]: NodeHashObj }>,
    ) => {
      state.globalNodesHash = action.payload;
    },
    setUserLinks: (state, action: PayloadAction<PositionedLink[]>) => {
      state.userLinks = action.payload;
    },
    updateRootNode: (
      state,
      action: PayloadAction<{ newRootId: number; oldRootNode: INode2 }>,
    ) => {
      const { newRootId, oldRootNode } = action.payload;

      if (newRootId && oldRootNode) {
        state.globalNodesHash[newRootId].is_current_root = true;
        state.globalNodesHash[newRootId].isShown = true;
        // if the oldRoot was the users node, hide it
        if (state.userNode && oldRootNode.id === state.userNode.id) {
          state.globalNodesHash[oldRootNode.id].isShown = false;
        }
        state.globalNodesHash[oldRootNode.id].is_current_root = false;
      } else {
        console.error("");
      }
    },
    createNewNode: (state, action: PayloadAction<NodeHashObj>) => {
      const newNode = action.payload;
      if (!state.globalNodesHash[newNode.id]) {
        state.globalNodesHash[newNode.id] = newNode;
      } else {
        console.log("Node with that ID already exists");
      }
    },
  },
});

export const {
  setActiveRootNode,
  setUserNodes,
  setUserLinks,
  updateRootNode,
  setUserNode,
  createNewNode,
} = ManageGraphSlice.actions;

export default ManageGraphSlice.reducer;

// ALL SCENARIOS ***************************************************************
// 1. No nodes are selected (createGroup OR createNode) - root as default source
// 2. 1 node selected (createNode) - selected node as default source

// 3. more than 1 node selected
// ----- groupNodes (createsSubGroup inside current group of selected nodes with selected nodes going into the subgroup)
// ----- createNode (where the new node will connect to all selected nodes [think creating a child of two parents])

// creating a group should always default to the userNode as the source
