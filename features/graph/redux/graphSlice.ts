import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  NodeStatus,
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
    selectedNodeIds: number[];
  };
  links: {
    byId: PosLinkMap;
    allIds: number[];
  };
}

const initialState: GraphSliceState = {
  userId: null,
  nodes: {
    byId: {},
    allIds: [],
    activeRootId: null,
    selectedNodeIds: [],
  },
  links: {
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
        nodes: PositionedNode[];
        links: PositionedLink[];
        // groups: PositionedGroup[];
      }>,
    ) => {
      const { nodes, links } = action.payload;

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

          // set active root id to user_id for initial load and push to selected
          if (newNode.depth === 1) {
            state.nodes.activeRootId = newNode.id;
            state.userId = newNode.id;
            state.nodes.selectedNodeIds.push(newNode.id);
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
    },

    // Update nodes' status while also updating parent/children if necessary
    toggleNode: (state, action: PayloadAction<number>) => {
      const nodeId = action.payload;

      if (state.nodes.byId[nodeId]) {
        const status = state.nodes.byId[nodeId].node_status;

        // make node active if it's "parent_active" or "inactive" when clicked
        if (status !== "active") {
          state.nodes.byId[nodeId].node_status = "active";
          // push id to selected ids if not in there already (it shouldn't be)
          if (!state.nodes.selectedNodeIds.includes(nodeId)) {
            state.nodes.selectedNodeIds.push(nodeId);
          }
          // !TODO: handle case of node click when active AND parent IS active
        } else if (false) {
          state.nodes.byId[nodeId].node_status = "parent_active";
          // handle case of node click while active AND parent is NOT active
        } else {
          state.nodes.byId[nodeId].node_status = "inactive";
          // remove id from selected ids if in there (it should be)
          if (state.nodes.selectedNodeIds.includes(nodeId)) {
            state.nodes.selectedNodeIds = [
              ...state.nodes.selectedNodeIds.filter((id) => id !== nodeId),
            ];
          }
        }

        console.log(state.nodes.selectedNodeIds);
      } else {
        console.error("Couldn't find node Id. graphSlice");
      }
    },
    deselectAllNodes: (state) => {
      // Update thhe statuses of the nodes in the object
      state.nodes.selectedNodeIds.forEach((id) => {
        // Set state to inactive unless node is root
        if (state.nodes.byId[id]) {
          if (state.nodes.byId[id].depth === 1) return;

          state.nodes.byId[id].node_status = "inactive";
        } else {
          console.error(
            "Unexpected. Ids in array should exist in nodes.byId object. graphSlice",
          );
        }
      });

      if (state.nodes.activeRootId) {
        state.nodes.selectedNodeIds = [state.nodes.activeRootId];
      } else {
        state.nodes.selectedNodeIds = [];
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

export const { setInitialState, toggleNode, swapRootNode, deselectAllNodes } =
  NewArchitectureSlice.actions;

export default NewArchitectureSlice.reducer;

// SELECTORS ******************************************************************
// Get all nodes that are currently selected or "active"
export const getSelectedNodes = createSelector(
  (state: RootState) => state.graphData.nodes.byId,
  (nodes) =>
    Object.values(nodes).filter(
      (node): node is UiNode => node.node_status === "active",
    ),
);

// Returns a node if ONLY ONE node is currently selected ("active")
export const getSoloSelectedNode = createSelector(
  getSelectedNodes,
  (selectedNodes) => (selectedNodes.length === 1 ? selectedNodes[0] : null),
);

// Get all links where a given node is the target (i.e., its parents)
const selectNodeParents = createSelector(
  (state: RootState) => state.graphData.links.byId,
  (state: RootState, nodeId: number) => nodeId,
  (links, nodeId) =>
    Object.values(links).filter((link) => link.target_id === nodeId),
);

// Derive a node's status based on its parent nodes' statuses
export const selectNodeStatus = createSelector(
  [selectNodeParents, (state: RootState) => state.graphData.nodes.byId],
  (parentLinks, nodes) => {
    // If any parent node is active, mark this node as `parent_active`
    const anyParentActive = parentLinks.some(
      (link) => nodes[link.source_id].node_status === "active",
    );
    return anyParentActive ? "parent_active" : "inactive";
  },
);
