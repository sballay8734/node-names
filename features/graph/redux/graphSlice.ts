import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Edges, Groups, UiNode, NodeStatus } from "@/lib/types/graph";
import { RootState } from "@/store/store";

export interface TestNode {
  id: number;
  depth: number;
  group_id: number | null;
  name: string;
  x: number;
  y: number;
}

export interface TestNodes {
  [id: number]: TestNode;
}

interface GraphSliceState {
  userId: number | null;
  nodes: {
    byId: TestNodes;
    allIds: number[];
    activeRootId: number | null;
    // activeNodeIds: D3Node[]
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
  userId: null,
  nodes: {
    byId: {},
    allIds: [],
    activeRootId: null,
    // activeNodeIds: []
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
        nodes: TestNode[];
        // edges: D3Edge[];
      }>,
    ) => {
      const { nodes } = action.payload;

      const nodeStatusMap: {
        [id: number]: { isCurrentRoot: boolean; node_status: string };
      } = {};

      // initialize nodes state
      nodes.forEach((node) => {
        if (!state.nodes.byId[node.id]) {
          const newNode = {
            ...node,
            isCurrentRoot: node.depth === 1,
            node_status: (node.depth === 1
              ? "active"
              : "inactive") as NodeStatus,
            isShown: true,
          };
          state.nodes.byId[node.id] = newNode;
          state.nodes.allIds.push(node.id);

          // set active root id to user for initial load
          if (newNode.depth === 1) {
            state.nodes.activeRootId = newNode.id;
            state.userId = newNode.id;
          }

          // store status in temporary map for SAFE look up during edges loop
          nodeStatusMap[node.id] = {
            isCurrentRoot: newNode.isCurrentRoot,
            node_status: newNode.node_status,
          };
        }
      });
    },

    toggleNode: (state, action: PayloadAction<number>) => {
      console.log("toggleNode");
      // const nodeId = action.payload;

      // // because you have 3 statuses, you need to slightly complicate logic
      // if (state.nodes.byId[nodeId]) {
      //   const status = state.nodes.byId[nodeId].node_status;

      //   // make node active if it's "parent_active" or "inactive" when clicked
      //   if (status !== "active") {
      //     state.nodes.byId[nodeId].node_status = "active";
      //     // !TODO: handle case of node click when active AND parent IS active
      //   } else if (false) {
      //     state.nodes.byId[nodeId].node_status = "parent_active";
      //     // handle case of node click while active AND parent is NOT active
      //   } else {
      //     state.nodes.byId[nodeId].node_status = "inactive";
      //   }
      // }
    },
    swapRootNode: (
      state,
      action: PayloadAction<{ newRootId: number; oldRootId: number }>,
    ) => {
      console.log("Swap Root");
      // const { newRootId, oldRootId } = action.payload;

      // state.nodes.activeRootId = newRootId;
      // state.nodes.byId[newRootId].isCurrentRoot = true;

      // state.nodes.byId[oldRootId].isCurrentRoot = false;
    },
  },
});

export const { setInitialState, toggleNode, swapRootNode } =
  NewArchitectureSlice.actions;

export default NewArchitectureSlice.reducer;

// SELECTORS ******************************************************************
export const getSelectedNodes = createSelector(
  (state: RootState) => state.graphData.nodes.byId,
  (nodes) =>
    Object.values(nodes).filter(
      (node): node is UiNode => node.node_status === "active",
    ),
);

export const getSoloSelectedNode = createSelector(
  getSelectedNodes,
  (selectedNodes) => (selectedNodes.length === 1 ? selectedNodes[0] : null),
);
