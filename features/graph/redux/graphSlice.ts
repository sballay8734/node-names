import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { REDUX_ACTIONS } from "@/lib/constants/actions";
import {
  PositionedLink,
  PositionedNode,
  PosLinkMap,
  PosNodeMap,
  UiNode,
} from "@/lib/types/graph";
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
    // THIS is where to add additional fields like "status" && "is_current_root"
    // setInitialState: (
    //   state,
    //   action: PayloadAction<{
    //     root: PositionedNode;
    //     nodes: PositionedNode[];
    //     links: PositionedLink[];
    //     groups: PositionedNode[];
    //   }>,
    // ) => {
    //   const { root, nodes, links, groups } = action.payload;

    //   // this map is used for quick lookup during links && groups loop
    //   const nodeStatusMap: {
    //     [id: number]: { isRoot: boolean; node_status: string };
    //   } = {};

    //   // Set root node
    //   const rootNode: UiNode = {
    //     ...root,
    //     isRoot: true,
    //     node_status: "active",
    //     isShown: true,
    //   };

    //   if (!state.nodes.byId[rootNode.id]) {
    //     // set root node stuff
    //     state.nodes.activeRootId = rootNode.id;
    //     state.userId = rootNode.id;
    //     state.nodes.selectedNodeIds.push(rootNode.id);
    //     state.nodes.focusedNodeId = rootNode.id;
    //     state.nodes.byId[rootNode.id] = rootNode;
    //     state.nodes.allIds.push(rootNode.id);

    //     nodeStatusMap[rootNode.id] = {
    //       isRoot: rootNode.isRoot,
    //       node_status: rootNode.node_status,
    //     };
    //   }

    //   // initialize groups
    //   groups.forEach((group) => {
    //     if (!state.groups.byId[group.id]) {
    //       const isRootGroup = group.type === "root_group";
    //       const newGroup: UiNode = {
    //         ...group,
    //         isRoot: false,
    //         node_status: isRootGroup ? "parent_active" : "inactive",
    //         isShown: true,
    //       };

    //       state.groups.byId[group.id] = newGroup;
    //       state.groups.allIds.push(group.id);

    //       nodeStatusMap[group.id] = {
    //         isRoot: newGroup.isRoot,
    //         node_status: newGroup.node_status,
    //       };
    //     }
    //   });

    //   // initialize nodes state (byId, allIds, & activeRootId)
    //   nodes.forEach((node) => {
    //     if (!state.nodes.byId[node.id]) {
    //       const newNode: UiNode = {
    //         ...node,
    //         isRoot: false,
    //         node_status: "inactive",
    //         isShown: true,
    //       };
    //       state.nodes.byId[node.id] = newNode;
    //       state.nodes.allIds.push(node.id);

    //       // store status in temporary map for SAFE look up during links loop
    //       nodeStatusMap[node.id] = {
    //         isRoot: newNode.isRoot,
    //         node_status: newNode.node_status,
    //       };
    //     }
    //   });

    //   // initialize edges state and use nodetStatusMap
    //   links.forEach((link) => {
    //     if (!state.links.byId[link.id]) {
    //       const sourceIsRoot = link.source_type === "root";

    //       state.links.byId[link.id] = {
    //         ...link,
    //         source_status: sourceIsRoot ? "active" : "inactive",
    //         target_status: sourceIsRoot ? "parent_active" : "inactive",
    //         link_status: "active",
    //       };

    //       state.links.allIds.push(link.id);

    //       if (!state.links.bySourceId[link.source_id]) {
    //         state.links.bySourceId[link.source_id] = [link.target_id];
    //       } else {
    //         state.links.bySourceId[link.source_id].push(link.target_id);
    //       }
    //     }
    //   });
    // },
    newSetInitialState: (
      state,
      action: PayloadAction<{
        nodesById: NodeHash;
        nodeIds: number[];
        rootGroupIds: number[];
        linksById: LinkHash;
        linksBySourceId: SourceHash;
        linksByTargetId: SourceHash;
        initActiveRootId: number | null;
      }>,
    ) => {
      const {
        nodesById,
        nodeIds,
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

      if (initActiveRootId) {
        state.nodes.selectedNodeIds.push(initActiveRootId);
      }

      state.nodes.activeRootId = initActiveRootId;
      state.nodes.focusedNodeId = initActiveRootId;
    },
    newToggleNode: (state, action: PayloadAction<number>) => {
      const clickedNode = state.nodes.byId[action.payload];
    },

    // Update nodes' status while also updating parent/children if necessary
    toggleNode: (state, action: PayloadAction<number>) => {
      const nodeId = action.payload;

      if (state.nodes.byId[nodeId]) {
        const status = state.nodes.byId[nodeId].node_status;

        // make node active if it's "parent_active" or "inactive" when clicked
        if (status !== true) {
          state.nodes.byId[nodeId].node_status = true;
          state.nodes.focusedNodeId = nodeId;
          // push id to selected ids if not in there already (it shouldn't be)
          if (!state.nodes.selectedNodeIds.includes(nodeId)) {
            state.nodes.selectedNodeIds.push(nodeId);
          }
          // !TODO: handle case of node click when active AND parent IS active
        } else if (false) {
          state.nodes.byId[nodeId].node_status = false;
          // handle case of node click while active AND parent is NOT active
        } else {
          state.nodes.byId[nodeId].node_status = false;
          // remove id from selected ids AND updated focusedNodeId
          if (state.nodes.selectedNodeIds.includes(nodeId)) {
            // remove node first
            const updatedNodeIds = [
              ...state.nodes.selectedNodeIds.filter((id) => id !== nodeId),
            ];
            const lastIndex = updatedNodeIds[updatedNodeIds.length - 1];

            // if array is not empty, set the last index to the active node id
            if (lastIndex) {
              state.nodes.focusedNodeId = lastIndex;
            } else {
              state.nodes.focusedNodeId = null;
            }

            // update the state
            state.nodes.selectedNodeIds = updatedNodeIds;
          }
        }

        updateActionButtonStates(state);
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
  // setInitialState,
  toggleNode,
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
