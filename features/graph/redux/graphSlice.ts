import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { REDUX_ACTIONS } from "@/lib/constants/actions";
import { REG_NODE_RADIUS } from "@/lib/constants/styles";
import {
  LinkStatus,
  PosLinkMap,
  PosNodeMap,
  UiLink,
  UiNode,
} from "@/lib/types/graph";
import { WindowSize } from "@/lib/types/misc";
import {
  CIRCLE_RADIUS,
  LinkHash,
  NodeHash,
  SourceHash,
} from "@/lib/utils/positionNodesOnLoad";
import { RootState } from "@/store/store";

const NODE_SPACING = REG_NODE_RADIUS;

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
    setInitialState: (
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
    updateNodePositions: (
      state,
      action: PayloadAction<{ nodeIds: number[]; windowSize: WindowSize }>,
    ) => {
      const totalRootGroups = state.rootGroups.allIds.length;

      if (totalRootGroups >= 7) return;

      const { nodeIds, windowSize } = action.payload;
      const nodesById = state.nodes.byId;
      const linkIds = state.links.allIds;
      const linksById = state.links.byId;
      const linksBySourceId = state.links.bySourceId;
      const rootGroupIds = state.rootGroups.allIds;

      // get window dimensions and center point
      const { width, height } = windowSize;
      const centerX = width / 2;
      const centerY = height / 2;
      // const radius = Math.min(width, height);
      const radius = CIRCLE_RADIUS;

      function positionRootGroupsAndNodes(nodesHash: NodeHash) {
        const rootGroups = Object.values(nodesHash).filter(
          (node: UiNode) => node.type === "root_group",
        );
        const angleStep = (2 * Math.PI) / rootGroups.length;

        rootGroups.forEach((root_group: UiNode, index: number) => {
          const startAngle = index * angleStep - Math.PI / 2;
          const endAngle = startAngle + angleStep;
          const centerAngle = (startAngle + endAngle) / 2;

          // Calculate the center of the group
          root_group.x =
            centerX + radius * (root_group.depth - 1) * Math.cos(centerAngle);
          root_group.y =
            centerY + radius * (root_group.depth - 1) * Math.sin(centerAngle);
          root_group.startAngle = startAngle;
          root_group.endAngle = endAngle;
          root_group.node_status = false;

          // console.log(root_group.x);
          // console.log(root_group.y);

          positionNodesInGroup(root_group);
        });
      }

      function positionNodesInGroup(root_group: UiNode) {
        const sourceGroup = linksBySourceId[root_group.id];
        if (!sourceGroup) return;

        const nodes = nodeIds.map((id) => state.nodes.byId[id]);

        const nodesInGroup: UiNode[] = nodes.filter(
          (node: UiNode) =>
            node.group_id === root_group.id && node.group_id !== node.id,
        );

        const groupSize = linksBySourceId[root_group.id].length;
        const groupCenterAngle =
          (root_group.startAngle + root_group.endAngle) / 2;
        const totalGroupWidth = (groupSize - 1) * NODE_SPACING;
        const startOffset = -totalGroupWidth / 2;

        nodesInGroup.forEach((node: UiNode, index) => {
          const offset = startOffset + index * NODE_SPACING;
          const nodeAngle = groupCenterAngle + Math.atan2(offset, radius);

          node.x = centerX + radius * node.depth * Math.cos(nodeAngle);
          node.y = centerY + radius * node.depth * Math.sin(nodeAngle);
          node.startAngle = root_group.startAngle;
          node.endAngle = root_group.endAngle;

          nodesById[node.id] = {
            ...node,
            isRoot: false,
            isShown: true,
            // node_status: root_group.node_status ? true : false,
            node_status: node.depth === 1 ? true : false,
          };
        });

        nodesById[root_group.id] = root_group;

        if (!rootGroupIds.includes(root_group.id)) {
          rootGroupIds.push(root_group.id);
        }
      }

      function positionLink(link_id: number) {
        const link = linksById[link_id];
        // const sourceStatus: LinkStatus = nodesById[link.source_id].node_status;

        // const linkStatus: LinkStatus = sourceStatus === true ? true : false;
        const linkStatus: LinkStatus = true;

        const updatedLink: UiLink = {
          ...link,
          x1: nodesById[link.source_id].x,
          y1: nodesById[link.source_id].y,
          x2: nodesById[link.target_id].x,
          y2: nodesById[link.target_id].y,
          link_status: linkStatus,
        };

        linksById[link_id] = updatedLink;
      }

      positionRootGroupsAndNodes(nodesById);
      linkIds.forEach((id) => positionLink(id));
    },
    toggleNode: (state, action: PayloadAction<number>) => {
      // OPTIMIZE: This code works but severely needs to be optimized
      const clickedNodeId = action.payload;
      const clickedNodeIsActive = state.nodes.byId[clickedNodeId].node_status;
      const clickedType = state.nodes.byId[clickedNodeId].type;
      const currentRootGroupId = state.nodes.activeRootGroupId;
      const clickedNode = state.nodes.byId[clickedNodeId];

      if (clickedType === "root") return;

      // IF CLICKED TYPE IS NODE
      if (clickedType === "node") {
        // if currentRootGroupId is null, activate the group
        if (!currentRootGroupId && clickedNode.group_id) {
          state.nodes.activeRootGroupId = clickedNode.group_id;
          state.nodes.byId[clickedNode.group_id].node_status = true;
          state.nodes.selectedNodeIds.push(clickedNode.group_id);
        } else if (clickedNode.group_id === currentRootGroupId) {
          // if currentRootGroupId is the same as the clickedNode.group_id
          // DON'T NEED TO HANDLE (Handled at the end)
        } else if (clickedNode.group_id !== currentRootGroupId) {
          // if currentRootGroupId is NOT the same as the clickedNode.group_id
          // deactivate all nodes in the old group that were active
          state.nodes.allIds.forEach((id) => {
            const node = state.nodes.byId[id];
            const nodeIsInOldGroup =
              state.nodes.byId[id].group_id === currentRootGroupId;
            if (node.node_status && nodeIsInOldGroup) {
              state.nodes.byId[id].node_status = false;
            }
            if (state.nodes.selectedNodeIds.includes(id)) {
              const updatedSelectedNodeIds = state.nodes.selectedNodeIds.filter(
                (nodeId) => nodeId !== id,
              );

              state.nodes.selectedNodeIds = [...updatedSelectedNodeIds];
            }
          });
          // set the new id for the rootGroup
          if (currentRootGroupId) {
            state.nodes.byId[currentRootGroupId].node_status = false;
          }
          if (clickedNode.group_id) {
            state.nodes.byId[clickedNode.group_id].node_status = true;
            state.nodes.selectedNodeIds.push(clickedNode.group_id);
          }
          state.nodes.activeRootGroupId = clickedNode.group_id;
        }
      }

      // IF CLICKED TYPE IS ROOT_GROUP
      if (clickedType === "root_group") {
        if (clickedNodeId === currentRootGroupId) {
          // deactivate all nodes with this group_id
          state.nodes.allIds.forEach((id) => {
            const node = state.nodes.byId[id];
            if (node.type !== "node") return;
            const nodeIsInOldGroup =
              state.nodes.byId[id].group_id === currentRootGroupId;
            if (node.node_status && nodeIsInOldGroup) {
              state.nodes.byId[id].node_status = false;
            }
            if (state.nodes.selectedNodeIds.includes(id)) {
              const updatedSelectedNodeIds = state.nodes.selectedNodeIds.filter(
                (nodeId) => nodeId !== id,
              );

              state.nodes.selectedNodeIds = [...updatedSelectedNodeIds];
            }
          });

          state.nodes.activeRootGroupId = null;
        } else if (clickedNodeId !== currentRootGroupId) {
          // deactivate all nodes with the old group_id
          state.nodes.allIds.forEach((id) => {
            const node = state.nodes.byId[id];
            if (node.type !== "node" && node.type !== "root_group") return;
            const nodeIsInOldGroup =
              state.nodes.byId[id].group_id === currentRootGroupId;
            if (node.node_status && nodeIsInOldGroup) {
              state.nodes.byId[id].node_status = false;
            }
            if (state.nodes.selectedNodeIds.includes(id)) {
              const updatedSelectedNodeIds = state.nodes.selectedNodeIds.filter(
                (nodeId) => nodeId !== id,
              );

              state.nodes.selectedNodeIds = [...updatedSelectedNodeIds];
            }
          });

          if (currentRootGroupId) {
            state.nodes.byId[currentRootGroupId].node_status = false;
          }
          state.nodes.activeRootGroupId = clickedNodeId;
        }
      }
      // IF CLICKED TYPE IS GROUP (Non root group, node group)
      if (clickedType === "group") {
        console.warn("UNHANDLED - see toggleNode in graphSlice");
      }
      // THINGS THAT SHOULD ALWAYS BE DONE WHEN A NODE IS CLICKED
      if (clickedNodeIsActive) {
        // 1. deactivate it if it was active.
        state.nodes.byId[clickedNodeId].node_status = false;
        const updatedSelectedNodes = state.nodes.selectedNodeIds.filter(
          (id) => id !== clickedNodeId,
        );

        state.nodes.selectedNodeIds = [...updatedSelectedNodes];
      } else {
        // 2. activate it if it was inactive
        state.nodes.byId[clickedNodeId].node_status = true;

        if (!state.nodes.selectedNodeIds.includes(clickedNodeId)) {
          state.nodes.selectedNodeIds.push(clickedNodeId);
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
    addRootGroup: (
      state,
      action: PayloadAction<{ newGroupName: string; windowSize: WindowSize }>,
    ) => {
      const { newGroupName, windowSize } = action.payload;
      const currentTotal = state.rootGroups.allIds.length;

      if (currentTotal >= 7) {
        console.log("You already have the maximum number of groups");
      } else {
        const randomId = Math.floor(Math.random() * 10000);
        const newNode: UiNode = {
          id: randomId,
          depth: 2,
          name: newGroupName,
          group_id: 1,
          source_id: 1,
          type: "root_group",
          group_name: newGroupName,
          source_type: "root",
          isRoot: false,
          node_status: true,
          isShown: true,
          startAngle: 0, // We'll calculate this later
          endAngle: 0, // We'll calculate this later
          x: 0, // We'll calculate this later
          y: 0, // We'll calculate this later
        };

        // Add the new root group
        state.nodes.byId[randomId] = newNode;
        state.nodes.allIds.push(randomId);
        state.rootGroups.allIds.push(randomId);
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
  setInitialState,
  createSubGroupFromSelection,
  moveNode,
  addRootGroup,
  updateNodePositions,
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
