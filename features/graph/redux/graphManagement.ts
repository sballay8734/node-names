import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";

import { INode2 } from "../types/graphManagementTypes";
import { NodeHashObj } from "../utils/getInitialNodes";

interface ManageGraphState {
  userNode: INode2 | null;

  activeRootNode: INode2 | null;
  activeRootType: "user" | "notUser";

  userNodes: { [x: number]: NodeHashObj };
  userLinks: PositionedLink[];

  inspectedNodes: PositionedNode[];
  inspectedLinks: PositionedLink[];
}

const initialState: ManageGraphState = {
  userNode: null,

  activeRootNode: null,
  activeRootType: "user",

  userNodes: {},
  userLinks: [],

  inspectedNodes: [],
  inspectedLinks: [],
};

const ManageGraphSlice = createSlice({
  name: "manageGraph",
  initialState,
  reducers: {
    // ROOT
    setActiveRootNode: (state, action: PayloadAction<INode2>) => {
      state.activeRootNode = {
        ...action.payload,
      };
    },

    // USER ********************************************************************
    setUserNode: (state, action: PayloadAction<INode2>) => {
      state.userNode = action.payload;
    },

    setUserNodes: (
      state,
      action: PayloadAction<{ [x: number]: NodeHashObj }>,
    ) => {
      state.userNodes = action.payload;
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
        state.userNodes[newRootId].is_current_root = true;
        state.userNodes[newRootId].isShown = true;
        // if the oldRoot was the users node, hide it
        if (state.userNode && oldRootNode.id === state.userNode.id) {
          state.userNodes[oldRootNode.id].isShown = false;
        }
        state.userNodes[oldRootNode.id].is_current_root = false;
      } else {
        console.error("");
      }
    },

    // Changes when user "inspects"
    setInspectedNodes: (state, action: PayloadAction<PositionedNode[]>) => {
      state.inspectedNodes = action.payload;
    },
    setInspectedLinks: (state, action: PayloadAction<PositionedLink[]>) => {
      state.userLinks = action.payload;
    },
  },
});

export const {
  setActiveRootNode,
  setUserNodes,
  setUserLinks,
  setInspectedNodes,
  setInspectedLinks,
  updateRootNode,
  setUserNode,
} = ManageGraphSlice.actions;

export default ManageGraphSlice.reducer;
