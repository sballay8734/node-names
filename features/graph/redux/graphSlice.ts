import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { REDUX_ACTIONS } from "@/lib/constants/actions";
import { PosLinkMap, PosNodeMap, UiNode } from "@/lib/types/graph";
import { LinkHash, NodeHash, SourceHash } from "@/lib/utils/positionGraphEls";
import { RootState } from "@/store/store";

export interface GraphSliceState {
  userId: number | null;
  nodes: {
    byId: PosNodeMap;
    allIds: number[];
    activeRootId: number | null;
    selectedNodeIds: number[];
    activeRootGroupId: number | null;
    totalRootGroups: number;
  };
  links: {
    byId: PosLinkMap;
    bySourceId: { [key: number]: number[] }; // for repositioning
    allIds: number[];
  };
  rootGroups: {
    byId: PosNodeMap;
    allIds: number[];
  };
  actionBtnById: { [key: string]: boolean };
}

const initialState: GraphSliceState = {
  userId: null,
  nodes: {
    byId: {},
    allIds: [],
    activeRootId: null,
    selectedNodeIds: [],
    activeRootGroupId: null,
    totalRootGroups: 0,
  },
  links: {
    byId: {},
    bySourceId: {},
    allIds: [],
  },
  rootGroups: {
    byId: {},
    allIds: [],
  },
  actionBtnById: REDUX_ACTIONS.reduce<{ [key: string]: boolean }>(
    (acc, current) => {
      acc[current] = false;
      return acc;
    },
    {},
  ),
};

const NewArchitectureSlice = createSlice({
  name: "newArchitecture",
  initialState,
  reducers: {
    newSetInitialState: (
      state,
      action: PayloadAction<{
        nodesById: NodeHash;
        nodeIds: number[];
        linkIds: number[];
        linksById: LinkHash;
        linksBySourceId: SourceHash;
        linksByTargetId: SourceHash;
        rootGroupIds: number[];
        initActiveRootId: number | null;
      }>,
    ) => {
      const {
        nodesById,
        nodeIds,
        linkIds,
        linksById,
        linksBySourceId,
        linksByTargetId,
        rootGroupIds,
        initActiveRootId,
      } = action.payload;

      state.nodes.byId = { ...nodesById };
      state.nodes.allIds = [...nodeIds];
      state.links.byId = { ...linksById };
      state.links.bySourceId = { ...linksBySourceId };
      state.rootGroups.allIds = [...rootGroupIds];
      state.links.allIds = [...linkIds];
    },
    toggleNode: (state, action: PayloadAction<number>) => {
      const clickedNodeId = action.payload;
      const clickedStatus = state.nodes.byId[clickedNodeId].node_status;
      const clickedType = state.nodes.byId[clickedNodeId].type;
      const currentRootGroupId = state.nodes.activeRootGroupId;

      // IF CLICKED TYPE IS NODE

      // IF CLICKED TYPE IS ROOT_GROUP

      // IF CLICKED TYPE IS GROUP (Non root group, node group)

      // THINGS THAT SHOULD ALWAYS BE DONE WHEN A NODE IS CLICKED

      // if an inactive node is clicked, activate both the node and the group
      if (clickedType === "node" && !clickedStatus) {
        state.nodes.byId[clickedNodeId].node_status = true;

        // deactivate any other root groups
        if (currentRootGroupId && currentRootGroupId !== clickedNodeId) {
          state.nodes.byId[currentRootGroupId].node_status = false;
        }

        // deactivate any nodes in the old root group
        state.nodes.allIds.forEach((id) => {
          const node = state.nodes.byId[id];
          if (
            node.type === "node" &&
            node.node_status &&
            node.group_id === currentRootGroupId
          ) {
            state.nodes.byId[id].node_status = false;
          }
        });

        // set the new active root group
        state.nodes.activeRootGroupId =
          state.nodes.byId[clickedNodeId].group_id;

        // set the actual nodes itself to active
        if (state.nodes.byId[clickedNodeId].group_id) {
          state.nodes.byId[
            state.nodes.byId[clickedNodeId].group_id
          ].node_status = true;
        }
      }

      if (clickedType === "root_group") {
        state.nodes.activeRootGroupId = clickedNodeId;
      }

      const nodeIsRoot = state.nodes.byId[clickedNodeId].type === "root";

      if (nodeIsRoot) return;

      if (clickedStatus === true) {
        // deactivate node
        state.nodes.byId[clickedNodeId].node_status = false;

        // !TODO: REFACTOR THIS WHOLE THING --- deactivate any nodes in the old root group

        if (clickedType === "root_group") {
          state.nodes.activeRootGroupId = null;
        }
        // update selectedNodeIds
        const updatedNodesIds = [
          ...state.nodes.selectedNodeIds.filter((id) => id !== clickedNodeId),
        ];

        state.nodes.selectedNodeIds = [...updatedNodesIds];
      } else if (!clickedStatus) {
        // activate node
        state.nodes.byId[clickedNodeId].node_status = true;

        if (clickedType === "root_group") {
          // check for a previous RGNode and deactivate it if there is
          if (currentRootGroupId && currentRootGroupId !== clickedNodeId) {
            state.nodes.byId[currentRootGroupId].node_status = false;
          }
          state.nodes.activeRootGroupId = clickedNodeId;
        }
      }
    },
    deselectAllNodes: (state) => {
      // Update the statuses of the nodes in the object
      state.nodes.selectedNodeIds.forEach((id) => {
        // Set state to inactive unless node is root
        if (state.nodes.byId[id]) {
          if (state.nodes.byId[id].depth === 1) return;

          state.nodes.byId[id].node_status = false;
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
      const { newRootId, oldRootId } = action.payload;

      console.log("Swap Root", "OLD:", oldRootId, "NEW:", newRootId);
    },
    createNewNode: (state) => {},
    createNewGroup: (state) => {
      const source_id =
        // get last id in array
        state.nodes.selectedNodeIds[state.nodes.selectedNodeIds.length - 1];

      if (source_id && state.nodes.byId[source_id].type === "node") {
        console.log("CREATE GROUP");
      } else {
        console.log("LAST SELECTED IS NOT VALID OR IS TYPE GROUP");
      }
    },
    createSubGroupFromSelection: (state) => {
      console.error("NOT CONFIGURED YET");
    },
    moveNode: (state) => {
      const source_id =
        // get last id in array
        state.nodes.selectedNodeIds[state.nodes.selectedNodeIds.length - 1];

      if (source_id && state.nodes.byId[source_id].type === "node") {
        console.log("MOVE NODE");
      } else {
        console.log("LAST SELECTED IS NOT VALID OR IS TYPE GROUP");
      }
    },
    addRootGroup: (state) => {
      const currentTotal = state.rootGroups.allIds.length;

      if (currentTotal >= 7) {
        console.log("You already have the maximum number of groups");
      } else {
        console.log("ADDING GROUP...");
      }
    },
  },
});

// Helper function to update action button states
const updateActionButtonStates = (state: GraphSliceState) => {
  const selectedNodesCount = state.nodes.selectedNodeIds.length;
  const lastSelectedNode =
    state.nodes.byId[state.nodes.selectedNodeIds[selectedNodesCount - 1]];
  const focusedIsTypeNode =
    lastSelectedNode && lastSelectedNode.type === "node";
  const focusedIsTypeGroup =
    lastSelectedNode && lastSelectedNode.type === "group";
  const focusedIsRoot = lastSelectedNode && lastSelectedNode.depth === 1;

  state.actionBtnById["createNewNode"] =
    selectedNodesCount > 0 &&
    (focusedIsTypeNode || focusedIsTypeGroup) &&
    !focusedIsRoot;
  state.actionBtnById["createNewGroup"] =
    selectedNodesCount > 0 && focusedIsTypeNode;
  state.actionBtnById["createNewSubGroupFromSelection"] =
    selectedNodesCount > 1 && !focusedIsRoot;
  state.actionBtnById["moveNode"] =
    selectedNodesCount > 0 && focusedIsTypeNode && !focusedIsRoot;
};

export const {
  toggleNode,
  swapRootNode,
  deselectAllNodes,
  createNewNode,
  createNewGroup,
  newSetInitialState,
  createSubGroupFromSelection,
  moveNode,
  addRootGroup,
} = NewArchitectureSlice.actions;

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
      (link) => nodes[link.source_id].node_status === true,
    );
    return anyParentActive ? "parent_active" : "inactive";
  },
);
