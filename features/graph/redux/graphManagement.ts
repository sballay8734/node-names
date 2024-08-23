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
} = ManageGraphSlice.actions;

export default ManageGraphSlice.reducer;
