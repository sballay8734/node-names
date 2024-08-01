import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Sex } from "@/types/dbTypes";

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
}

interface ManageGraphState {
  activeRootNode: INode2 | null;
  activeRootType: "user" | "notUser";

  userNodes: INode2[];
  inspectedNodes: INode2[];
}

const initialState: ManageGraphState = {
  activeRootNode: null,
  activeRootType: "user",

  userNodes: [],
  inspectedNodes: [],
};

const ManageGraphSlice = createSlice({
  name: "manageGraph",
  initialState,
  reducers: {
    setActiveRootNode: (state, action: PayloadAction<INode2>) => {
      state.activeRootNode = action.payload;
    },
  },
});

export const { setActiveRootNode } = ManageGraphSlice.actions;

export default ManageGraphSlice.reducer;