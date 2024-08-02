import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";

export interface INode2 {
  id: number;
  created_at: string;
  first_name: string;
  sex: string;
  source_node_ids: string[] | null; // only the userRoot will be null

  group_id: number | null;
  group_name: string | null;
  last_name: string | null;
  maiden_name: string | null;
  preferred_name: string | null;
  phonetic_name: string | null;

  date_of_birth: string | null;
  date_of_death: string | null;
  gift_ideas: string[] | null;

  partner_id: number | null;
  partner_type: "spouse" | "dating" | "divorced" | null;

  shownConnections: number;
  hiddenConnections: number;
}

interface ManageGraphState {
  activeRootNode: INode2 | null;
  activeRootType: "user" | "notUser";

  userNodes: PositionedNode[];
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
    setActiveRootNode: (state, action: PayloadAction<PositionedNode>) => {
      state.activeRootNode = action.payload;
    },

    // USER (Will not change often)
    setUserNodes: (state, action: PayloadAction<PositionedNode[]>) => {
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
