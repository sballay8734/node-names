import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  EdgeStatus,
  RawEdge,
  RawGroup,
  RawVertex,
  UiEdge,
  UiGroup,
  UiVertex,
  VertexStatus,
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
    setInitialState: (
      state,
      action: PayloadAction<{
        vertices: RawVertex[];
        edges: RawEdge[];
      }>,
    ) => {
      const { vertices, edges } = action.payload;

      const vertexStatusMap: {
        [id: number]: { isCurrentRoot: boolean; vertex_status: string };
      } = {};

      // initialize vertices state
      vertices.forEach((vertex) => {
        if (!state.vertices.byId[vertex.id]) {
          const newVertex = {
            ...vertex,
            isCurrentRoot: vertex.is_user,
            vertex_status: (vertex.is_user
              ? "active"
              : "inactive") as VertexStatus,
          };
          state.vertices.byId[vertex.id] = newVertex;
          state.vertices.allIds.push(vertex.id);

          // store status in temporary map for SAFE look up during edges loop
          vertexStatusMap[vertex.id] = {
            isCurrentRoot: newVertex.isCurrentRoot,
            vertex_status: newVertex.vertex_status,
          };
        }
      });

      // initialize edges state and use vertextStatusMap
      edges.forEach((edge) => {
        if (!state.edges.byId[edge.id]) {
          const vertex1InMap = vertexStatusMap[edge.vertex_1_id];
          const vertex2InMap = vertexStatusMap[edge.vertex_2_id];

          state.edges.byId[edge.id] = {
            ...edge,
            vertex_1_status: vertex1InMap
              ? (vertex1InMap.vertex_status as VertexStatus)
              : "inactive",
            vertex_2_status: vertex2InMap
              ? (vertex2InMap.vertex_status as VertexStatus)
              : "inactive",
            edge_status:
              (vertex1InMap && vertex1InMap.isCurrentRoot) ||
              (vertex2InMap && vertex2InMap.isCurrentRoot)
                ? "active"
                : "inactive",
          };
        }
      });
    },
  },
});

export const { setInitialState } = NewArchitectureSlice.actions;

export default NewArchitectureSlice.reducer;
