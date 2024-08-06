import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";
import { Partner } from "@/types/dbTypes";

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
  partner_details: Partner[] | null;

  shownConnections: number;
  hiddenConnections: number;
  children_ids: string[] | null;
}

// !TODO: Current issue is that you're calculating shown/hidden connections at run time, thus you had to alter the interfaces to make it work (not ideal)
export interface TempTillDbFix
  extends Omit<INode2, "shownConnections" | "hiddenConnections"> {}

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
    setActiveRootNode: (state, action: PayloadAction<TempTillDbFix>) => {
      state.activeRootNode = {
        ...action.payload,
        hiddenConnections: 0,
        shownConnections: 0,
      };
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
