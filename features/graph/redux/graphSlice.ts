import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  GroupStatus,
  NodeStatus,
  PosGroupMap,
  PositionedGroup,
  PositionedLink,
  PositionedNode,
  PosLinkMap,
  PosNodeMap,
  UiNode,
} from "@/lib/types/graph";
import { RootState } from "@/store/store";

interface GraphSliceState {
  userId: number | null;
  nodes: {
    byId: PosNodeMap;
    allIds: number[];
    activeRootId: number | null;
    // activeNodeIds: D3Node[]
  };
  links: {
    byId: PosLinkMap;
    allIds: number[];
  };
  groups: {
    byId: PosGroupMap;
    bySourceId: PosGroupMap;
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
  links: {
    byId: {},
    allIds: [],
  },
  groups: {
    byId: {},
    bySourceId: {},
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
        nodes: PositionedNode[];
        links: PositionedLink[];
        groups: PositionedGroup[];
      }>,
    ) => {
      const { nodes, links, groups } = action.payload;

      // this map is used for quick lookup during links && groups loop
      const nodeStatusMap: {
        [id: number]: { isRoot: boolean; node_status: string };
      } = {};

      // initialize nodes state (byId, allIds, & activeRootId)
      nodes.forEach((node) => {
        if (!state.nodes.byId[node.id]) {
          const newNode = {
            ...node,
            isRoot: node.depth === 1,
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

          // store status in temporary map for SAFE look up during links loop
          nodeStatusMap[node.id] = {
            isRoot: newNode.isRoot,
            node_status: newNode.node_status,
          };
        }
      });

      // initialize edges state and use nodetStatusMap
      links.forEach((link) => {
        if (!state.links.byId[link.id]) {
          const node1InMap = nodeStatusMap[link.source_id];
          const node2InMap = nodeStatusMap[link.target_id];

          state.links.byId[link.id] = {
            ...link,
            node_1_status: node1InMap
              ? (node1InMap.node_status as NodeStatus)
              : "inactive",
            node_2_status: node2InMap
              ? (node2InMap.node_status as NodeStatus)
              : "inactive",
            link_status:
              (node1InMap && node1InMap.isRoot) ||
              (node2InMap && node2InMap.isRoot)
                ? "active"
                : "inactive",
          };

          state.links.allIds.push(link.id);
        }
      });

      groups.forEach((group) => {
        if (!state.groups.byId[group.id]) {
          const updatedGroup = {
            ...group,
            group_status: "active" as GroupStatus,
            isShown: true,
          };
          state.groups.byId[group.id] = updatedGroup;
          state.groups.allIds.push(group.id);
        }
      });

      console.log(state);
    },

    toggleNode: (state, action: PayloadAction<number>) => {
      console.log("toggleNode");
      const nodeId = action.payload;

      // because you have 3 statuses, you need to slightly complicate logic
      if (state.nodes.byId[nodeId]) {
        const status = state.nodes.byId[nodeId].node_status;

        // make node active if it's "parent_active" or "inactive" when clicked
        if (status !== "active") {
          state.nodes.byId[nodeId].node_status = "active";
          // !TODO: handle case of node click when active AND parent IS active
        } else if (false) {
          state.nodes.byId[nodeId].node_status = "parent_active";
          // handle case of node click while active AND parent is NOT active
        } else {
          state.nodes.byId[nodeId].node_status = "inactive";
        }
      }
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
