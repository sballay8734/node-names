import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  RawEdge,
  RawGroup,
  RawVertex,
  UiEdge,
  UiGroup,
  UiVertex,
} from "@/types/newArchTypes";

// FINAL SHAPE ****************************************************************
interface Edges {
  [id: number]: UiEdge;
}
interface Vertices {
  [id: number]: UiVertex;
}
interface Groups {
  [id: number]: UiGroup;
}

interface GraphSliceState {
  vertices: {
    byId: Vertices;
    allIds: number[];
  };
  edges: {
    byId: Edges;
    allIds: number[];
  };
  groups: {
    byId: Groups;
    allIds: number[];
  };
}

const initialState: GraphSliceState = {
  vertices: {
    byId: {},
    allIds: [],
  },
  edges: {
    byId: {},
    allIds: [],
  },
  groups: {
    byId: {},
    allIds: [],
  },
};

const NewArchitectureSlice = createSlice({
  name: "newArchitecture",
  initialState,
  reducers: {
    // THIS is where to add additional fields like "status" && "is_current_root"
    setState: (
      state,
      action: PayloadAction<{
        vertices: RawVertex;
        edges: RawEdge;
        groups: RawGroup;
      }>,
    ) => {},
  },
});

export const { setState } = NewArchitectureSlice.actions;

export default NewArchitectureSlice.reducer;
