import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";

import { INode2 } from "../types/graphManagementTypes";
import { NodeHashObj } from "../utils/getShownNodesAndConnections";

interface ManageGraphState {
  activeRootNode: INode2 | null;
  activeRootType: "user" | "notUser";

  userNodes: { [x: number]: NodeHashObj };
  userLinks: PositionedLink[];

  inspectedNodes: PositionedNode[];
  inspectedLinks: PositionedLink[];
}

const initialState: ManageGraphState = {
  activeRootNode: null,
  activeRootType: "user",

  userNodes: [],
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

    // USER (Will not change often)
    setUserNodes: (
      state,
      action: PayloadAction<{ [x: number]: NodeHashObj }>,
    ) => {
      state.userNodes = action.payload;
    },
    setUserLinks: (state, action: PayloadAction<PositionedLink[]>) => {
      state.userLinks = action.payload;
    },
    updateUserNodes: (state, action: PayloadAction<PositionedNode[]>) => {
      const nodes = action.payload;

      // !TODO: This logic is wrong. It's just for testing if the dispatch speeds things up. You need to actually track which nodes should be shown for which rootNodes in order for this to work. When the rootNode changes, you're trying to avoid recalculating all the positions so you need to be able to tell each node in the hash if it should be shown or not.
      nodes.forEach((n) => {
        if (state.userNodes[n.id]) {
          state.userNodes[n.id].isShown = !state.userNodes[n.id].isShown;
        }
      });
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
  updateUserNodes,
} = ManageGraphSlice.actions;

export default ManageGraphSlice.reducer;
