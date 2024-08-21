import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";
import { Child, Parent, Partner } from "@/types/dbTypes";

export interface INode2 {
  id: number;
  created_at: string;
  first_name: string;
  sex: string;

  group_id: number | null;
  group_name: string | null;
  last_name: string | null;
  maiden_name: string | null;
  preferred_name: string | null;
  phonetic_name: string | null;

  date_of_birth: string | null;
  date_of_death: string | null;
  gift_ideas: string[] | null;

  partner_details: Partner[] | null;
  parent_details: Parent[] | null;
  children_details: Child[] | null;

  depth_from_user: number;
  shallowest_ancestor: number;

  shownConnections: number;
  hiddenConnections: number;
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

const testFormat = [
  {
    id: 2,
    created_at: "2024-07-20T14:08:06.754277+00:00",
    first_name: "Aaron",
    last_name: "Mackenzie",
    maiden_name: null,
    group_id: 2,
    sex: "male",
    phonetic_name: "Ah run",
    group_name: "Best Friends",
    date_of_birth: null,
    date_of_death: null,
    gift_ideas: ["Baby thing1", "Babything2", "Workout app"],
    preferred_name: "Amac",
    partner_details: [
      { status: "current", partner_id: 9, children_ids: [10] },
      { status: "ex", partner_id: 20, children_ids: [21] },
    ],
    depth_from_user: 1,
    children_details: [
      {
        child_id: 10,
        adoptive_parents_ids: [],
        biological_parents_ids: [2, 9],
      },
    ],
    parent_details: [
      {
        parent_id: 14,
        adoptive_children_ids: [],
        biological_children_ids: [2, 11],
      },
      {
        parent_id: 15,
        adoptive_children_ids: [],
        biological_children_ids: [2, 11],
      },
    ],
    shallowest_ancestor: 1,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 12,
    created_at: "2024-07-20T14:26:16.95771+00:00",
    first_name: "Eric",
    last_name: "Something",
    maiden_name: null,
    group_id: null,
    sex: "male",
    phonetic_name: null,
    group_name: null,
    date_of_birth: "1986-11-01",
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: [
      { status: "current", partner_id: 11, children_ids: [13] },
    ],
    depth_from_user: 4,
    children_details: [
      {
        child_id: 13,
        adoptive_parents_ids: [],
        biological_parents_ids: [12, 11],
      },
    ],
    parent_details: null,
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 11,
    created_at: "2024-07-20T14:25:46.090227+00:00",
    first_name: "Lauren",
    last_name: "Something",
    maiden_name: "Mackenzie",
    group_id: null,
    sex: "female",
    phonetic_name: null,
    group_name: null,
    date_of_birth: null,
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: [
      { status: "current", partner_id: 12, children_ids: [13] },
    ],
    depth_from_user: 3,
    children_details: [
      {
        child_id: 13,
        adoptive_parents_ids: [],
        biological_parents_ids: [12, 11],
      },
    ],
    parent_details: [
      {
        parent_id: 14,
        adoptive_children_ids: [],
        biological_children_ids: [2, 11],
      },
      {
        parent_id: 15,
        adoptive_children_ids: [],
        biological_children_ids: [2, 11],
      },
    ],
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 15,
    created_at: "2024-07-20T14:34:27.214013+00:00",
    first_name: "Carmen",
    last_name: "Mackenzie",
    maiden_name: null,
    group_id: null,
    sex: "female",
    phonetic_name: null,
    group_name: null,
    date_of_birth: "1989-06-01",
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: [
      { status: "current", partner_id: 14, children_ids: [2, 11] },
    ],
    depth_from_user: 3,
    children_details: [
      {
        child_id: 2,
        adoptive_parents_ids: [],
        biological_parents_ids: [14, 15],
      },
      {
        child_id: 11,
        adoptive_parents_ids: [],
        biological_parents_ids: [14, 15],
      },
    ],
    parent_details: null,
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 13,
    created_at: "2024-07-20T14:26:48.225131+00:00",
    first_name: "Mackenzie",
    last_name: "Something",
    maiden_name: null,
    group_id: null,
    sex: "female",
    phonetic_name: null,
    group_name: null,
    date_of_birth: null,
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: null,
    depth_from_user: 4,
    children_details: null,
    parent_details: [
      {
        parent_id: 11,
        adoptive_children_ids: [],
        biological_children_ids: [13],
      },
      {
        parent_id: 12,
        adoptive_children_ids: [],
        biological_children_ids: [13],
      },
    ],
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 20,
    created_at: "2024-08-05T23:03:37.796964+00:00",
    first_name: "Gina",
    last_name: "AaronEx",
    maiden_name: null,
    group_id: 3,
    sex: "female",
    phonetic_name: null,
    group_name: null,
    date_of_birth: null,
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: [{ status: "ex", partner_id: 2, children_ids: [21] }],
    depth_from_user: 3,
    children_details: [
      {
        child_id: 21,
        adoptive_parents_ids: [],
        biological_parents_ids: [20, 2],
      },
    ],
    parent_details: null,
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 14,
    created_at: "2024-07-20T14:34:08.695662+00:00",
    first_name: "Joe",
    last_name: "Mackenzie",
    maiden_name: null,
    group_id: null,
    sex: "male",
    phonetic_name: null,
    group_name: null,
    date_of_birth: "1995-12-01",
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: [
      { status: "current", partner_id: 15, children_ids: [2, 11] },
    ],
    depth_from_user: 3,
    children_details: [
      {
        child_id: 2,
        adoptive_parents_ids: [],
        biological_parents_ids: [14, 15],
      },
      {
        child_id: 11,
        adoptive_parents_ids: [],
        biological_parents_ids: [14, 15],
      },
    ],
    parent_details: null,
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 9,
    created_at: "2024-07-20T14:24:47.404169+00:00",
    first_name: "Rachel",
    last_name: "Mackenzie",
    maiden_name: null,
    group_id: null,
    sex: "female",
    phonetic_name: null,
    group_name: null,
    date_of_birth: null,
    date_of_death: null,
    gift_ideas: null,
    preferred_name: "Rach",
    partner_details: [{ status: "current", partner_id: 2, children_ids: [10] }],
    depth_from_user: 2,
    children_details: [
      {
        child_id: 10,
        adoptive_parents_ids: [],
        biological_parents_ids: [2, 9],
      },
    ],
    parent_details: null,
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 10,
    created_at: "2024-07-20T14:25:12.091096+00:00",
    first_name: "Levi",
    last_name: "Mackenzie",
    maiden_name: null,
    group_id: null,
    sex: "male",
    phonetic_name: null,
    group_name: null,
    date_of_birth: null,
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: null,
    depth_from_user: 2,
    children_details: null,
    parent_details: [
      {
        parent_id: 2,
        adoptive_children_ids: [],
        biological_children_ids: [10, 21],
      },
      {
        parent_id: 9,
        adoptive_children_ids: [],
        biological_children_ids: [10],
      },
    ],
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
  {
    id: 21,
    created_at: "2024-08-05T23:05:26.466483+00:00",
    first_name: "Aarons2ndChild",
    last_name: "Aarons2nd",
    maiden_name: null,
    group_id: null,
    sex: "male",
    phonetic_name: null,
    group_name: null,
    date_of_birth: null,
    date_of_death: null,
    gift_ideas: null,
    preferred_name: null,
    partner_details: null,
    depth_from_user: 2,
    children_details: null,
    parent_details: [
      {
        parent_id: 2,
        adoptive_children_ids: [],
        biological_children_ids: [10, 21],
      },
      {
        parent_id: 20,
        adoptive_children_ids: [],
        biological_children_ids: [21],
      },
    ],
    shallowest_ancestor: 2,
    hiddenConnections: 0,
    shownConnections: 0,
  },
];
