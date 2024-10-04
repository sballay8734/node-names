import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { REDUX_ACTIONS } from "@/lib/constants/actions";
import { PosLinkMap, PosNodeMap, UiNode } from "@/lib/types/graph";
import { LinkHash, NodeHash, SourceHash } from "@/lib/utils/positionGraphEls";
import { CreatedNode, updatePositions } from "@/lib/utils/repositionGraphEls";
import { RootState } from "@/store/store";

export interface GraphSliceState {
  userId: number | null;
  nodes: {
    byId: PosNodeMap;
    allIds: number[];
    activeRootId: number | null;
    selectedNodeIds: number[];
    focusedNodeId: number | null;
    activeRootGroupId: number | null;
  };
  links: {
    byId: PosLinkMap;
    bySourceId: { [key: number]: number[] }; // for repositioning
    byTargetId: { [key: number]: number[] }; // for statuses
    allIds: number[];
  };
  groups: {
    byId: PosNodeMap;
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
    focusedNodeId: null,
    activeRootGroupId: null,
  },
  links: {
    byId: {},
    bySourceId: {},
    byTargetId: {},
    allIds: [],
  },
  groups: {
    byId: {},
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

      // if (initActiveRootId) {
      //   state.nodes.selectedNodeIds.push(initActiveRootId);
      // }

      // state.nodes.activeRootId = initActiveRootId;
      // state.nodes.focusedNodeId = initActiveRootId;
    },
    newToggleNode: (state, action: PayloadAction<number>) => {
      const clickedNodeId = action.payload;
      const clickedStatus = state.nodes.byId[clickedNodeId].node_status;
      const clickedType = state.nodes.byId[clickedNodeId].type;

      if (clickedType === "root_group") {
        state.nodes.activeRootGroupId = clickedNodeId;
      }

      const nodeIsRoot = state.nodes.byId[clickedNodeId].type === "root";

      if (nodeIsRoot) return;

      // if node is focused and active
      if (clickedStatus === true) {
        // deactivate node
        state.nodes.byId[clickedNodeId].node_status = false;
        // update selectedNodeIds
        const updatedNodesIds = [
          ...state.nodes.selectedNodeIds.filter((id) => id !== clickedNodeId),
        ];

        state.nodes.selectedNodeIds = [...updatedNodesIds];
      } else if (!clickedStatus) {
        // activate node
        state.nodes.byId[clickedNodeId].node_status = true;
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
    createNewNode: (state) => {
      if (!state.nodes.focusedNodeId)
        return console.error("from createNewNode");

      // get last id in array
      const source = state.nodes.byId[state.nodes.focusedNodeId];

      if (source) {
        // REMOVE: FOR TESTING
        const currentName = state.nodes.byId[state.nodes.focusedNodeId].name;
        const newNode = {
          id: Math.floor(Math.random() * 10000),
          depth: 3,
          name: "TEST",
          group_id: 7, // friends
          type: "node",
          group_name: currentName,
          source_type: "group",
        };
        // this function needs to return an array of repositioned nodes
        const updatedNodes: UiNode[] | undefined = updatePositions(
          state,
          source,
          newNode as CreatedNode,
        );

        updatedNodes?.forEach((node) => {
          const updatedNode = {
            ...node,
            x: node.x,
            y: node.y,
          };

          if (state.nodes.byId[node.id]) {
            state.nodes.byId[node.id] = updatedNode;
          } else {
            state.nodes.byId[node.id] = updatedNode;
            state.nodes.allIds.push(node.id);
          }
        });

        console.log("NODE CREATED!");
      } else {
        console.log("THERE IS NO VALID SOURCE");
      }
    },
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
  newToggleNode,
  swapRootNode,
  deselectAllNodes,
  createNewNode,
  createNewGroup,
  newSetInitialState,
  createSubGroupFromSelection,
  moveNode,
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
