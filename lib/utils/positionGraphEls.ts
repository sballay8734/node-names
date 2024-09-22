import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { store } from "@/store/store";

import { NODE_SPACING_FACTOR, REG_NODE_RADIUS } from "../constants/styles";
import {
  PositionedLink,
  PositionedNode,
  RawLink,
  RawNode,
  UiLink,
  UiNode,
} from "../types/graph";
import { WindowSize } from "../types/misc";

interface NodeHash {
  [key: number]: PositionedNode;
}

type mapKey = "root" | "root_group" | "group" | "node";

// REMOVE: should be passed eventually
const userId = 1;
const MAX_ROOT_GROUPS = 7;
const MAX_NODES = 1000;
const RADIUS_FACTOR = 0.3;
const PADDING = 5;
const NODE_SPACING = REG_NODE_RADIUS * 2 + PADDING;

// export function positionGraphEls(
//   data: { nodes: RawNode[]; links: RawLink[] },
//   windowSize: WindowSize,
// ): {
//   data: {
//     nodes: PositionedNode[];
//     links: PositionedLink[];
//   };
// } {
//   const width = windowSize.width;
//   const height = windowSize.height;
//   const { nodes, links } = data;

//   // Calculate the center of the circle
//   const centerX = width / 2;
//   const centerY = height / 2;

//   const radius = Math.min(width, height) * 0.13;

//   // ** NEWWWWW ***************************************************************
//   // initialize and set nodesMap && linksMap
//   const nodesMap: { [id: string]: RawNode } = {};
//   const linksMap: { [id: string]: RawLink } = {};

//   let rootNodeId: number = 0;
//   const groupNodeIds: number[] = [];
//   const rootGroupNodeIds: number[] = [];
//   const nonGroupNodeIds: number[] = [];

//   const rootGroupNodes: RawNode[] = [];
//   const allGroupNodes: RawNode[] = [];
//   const nonGroupNodes: RawNode[] = [];

//   nodes.forEach((node) => {
//     const type = node.type;
//     if (!nodesMap[node.id]) {
//       nodesMap[node.id] = {
//         ...node,
//       };
//       // set root node id
//       if (node.depth === 1) {
//         rootNodeId = node.id;
//       }
//       if (node.source_type === "root" && !rootGroupNodeIds.includes(node.id)) {
//         rootGroupNodes.push(node);
//         rootGroupNodeIds.push(node.id);
//       }
//       if (type === "group" && !groupNodeIds.includes(node.id)) {
//         allGroupNodes.push(node);
//         groupNodeIds.push(node.id);
//       } else if (type === "node" && !nonGroupNodeIds.includes(node.id)) {
//         nonGroupNodes.push(node);
//         nonGroupNodeIds.push(node.id);
//       } else {
//         console.error("Something went wrong in postionGraphEls.ts");
//       }
//     } else {
//       console.error("Duplicate node_id found!", node.id);
//     }
//   });

//   const rootNode = nodes.find((node) => node.id === rootNodeId);

//   // Create a map to store the root Group positions
//   const rootGroupPositions: { [nodeId: number]: PositionedNode } = {};

//   // Calculate postions for each ROOT GROUP FIRST
//   const positionedRootGroups: PositionedNode[] = rootGroupNodes.map(
//     (groupNode, index) => {
//       const angleOffset =
//         rootGroupNodes.length % 2 === 0 ? Math.PI / rootGroupNodes.length : 0;

//       const angle =
//         (index / rootGroupNodes.length) * 2 * Math.PI -
//         Math.PI / 2 +
//         angleOffset;

//       const x = centerX + radius * Math.cos(angle);
//       const y = centerY + radius * Math.sin(angle);

//       const updatedNode = {
//         ...groupNode,
//         angle,
//         x,
//         y,
//       };

//       if (!rootGroupPositions[groupNode.id]) {
//         rootGroupPositions[groupNode.id] = updatedNode;
//       }

//       return updatedNode;
//     },
//   );

//   // !TODO: Here is where you will also calc the positions for non-root groups

//   function getPersonPosition(
//     node: RawNode,
//     groupSize: number,
//     nodeIndex: number,
//   ): PositionedNode {
//     if (node.depth === 1) {
//       return { ...node, angle: 0, x: centerX, y: centerY }; // Place userNode in center
//     }

//     if (node.group_id === null) {
//       console.warn(
//         "There should be no nodes in this function with a group_id equal to null",
//         node.id,
//       );
//       return { ...node, angle: 0, x: centerX, y: centerY };
//     }

//     // Get position of the group
//     const groupPos = rootGroupPositions[node.group_id];
//     if (!groupPos || isNaN(groupPos.x) || isNaN(groupPos.y)) {
//       console.warn(`No valid position found for group ${node.group_id}`);
//       return { ...node, angle: 0, x: centerX, y: centerY }; // Fallback to center position
//     }

//     // Ensure groupSize is valid and prevent division by zero
//     if (groupSize <= 0) {
//       console.warn(`Group ${node.group_id} has no valid members or size`);
//       return { ...node, angle: 0, x: groupPos.x, y: groupPos.y }; // Fallback to group position
//     }

//     // Calculate the angle of the group's position relative to the root
//     const rootToGroupAngle = Math.atan2(
//       groupPos.y - centerY,
//       groupPos.x - centerX,
//     );

//     // Restrict node positions to an arc on the far side of the group
//     const arcSpan = (Math.PI / 3) * NODE_SPACING_FACTOR; // 120 degrees in radians

//     let angleOffset;

//     if (groupSize % 2 === 0) {
//       // Even number of nodes: distribute symmetrically
//       angleOffset = -arcSpan / 2 + (nodeIndex * arcSpan) / (groupSize - 1); // Prevent division by zero
//     } else {
//       // Odd number of nodes: center the middle node and distribute others around
//       const middleIndex = (groupSize - 1) / 2; // Get the index of the middle node
//       angleOffset = ((nodeIndex - middleIndex) * arcSpan) / groupSize; // Symmetric distribution
//     }

//     // Calculate the final angle for this node
//     const nodeAngle = rootToGroupAngle + angleOffset;

//     // Set a distance from the group
//     const distanceFromGroup = 100;

//     // Compute the final position of the node
//     const x = groupPos.x + distanceFromGroup * Math.cos(nodeAngle);
//     const y = groupPos.y + distanceFromGroup * Math.sin(nodeAngle);

//     // Ensure x and y are valid numbers
//     if (isNaN(x) || isNaN(y)) {
//       console.error(
//         `Invalid position calculated for node ${node.id}: x=${x}, y=${y}`,
//       );
//       return { ...node, angle: 0, x: centerX, y: centerY }; // Fallback position
//     }

//     return {
//       ...node,
//       angle: nodeAngle,
//       x,
//       y,
//     };
//   }

//   // Map over the non-group nodes with updated logic
//   const positionedNonGroupNodes: PositionedNode[] = nonGroupNodes.map(
//     (node) => {
//       const nodesInGroup = nonGroupNodes.filter(
//         (n) => n.group_id === node.group_id,
//       );
//       const groupSize = nodesInGroup.length; // Get group size
//       const nodeIndex = nodesInGroup.findIndex((n) => n.id === node.id); // Get node index within group
//       return getPersonPosition(node, groupSize, nodeIndex);
//     },
//   );

//   // Calculate positions for links
//   // !TODO: THIS NEEDS TO BE FIXED (Does not support NON-ROOT-GroupNodes)
//   const positionedLinks: PositionedLink[] = links.map((link) => {
//     let source;
//     let target;

//     // if link goes from node TO group, search groups for the target
//     if (link.relation_type === null) {
//       source = positionedNonGroupNodes.find(
//         (node) => node.id === link.source_id,
//       );
//       target = positionedRootGroups.find((r) => r.id === link.target_id);
//     } else if (link.relation_type !== null) {
//       // if link goes from group TO node, search nodes for the target
//       source = positionedRootGroups.find((p) => p.id === link.source_id);
//       target = positionedNonGroupNodes.find((p) => p.id === link.target_id);
//     }
//     return {
//       ...link,
//       x1: source?.x ?? centerX,
//       y1: source?.y ?? centerY,
//       x2: target?.x ?? centerX,
//       y2: target?.y ?? centerY,
//     };
//   });

//   const combined = [...positionedRootGroups, ...positionedNonGroupNodes];

//   store.dispatch(
//     setInitialState({
//       root: combined[0],
//       nodes: combined,
//       links: positionedLinks,
//       groups: [],
//     }),
//   );

//   return { data: { nodes: combined, links: positionedLinks } };
// }

export function newINITPosFunc(
  allNodes: RawNode[],
  links: RawLink[],
  windowSize: WindowSize,
) {
  // get window dimensions and center point
  const { width, height } = windowSize;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * RADIUS_FACTOR;

  const nodesById: NodeHash = {};
  const groupSizeById: { [key: number]: { count: number; ids: number[] } } = {}; // does not include root

  // loop through nodes ONCE and set items instead of filtering 4 times.
  const nodesByType: Record<mapKey, PositionedNode[]> = {
    root: [],
    root_group: [],
    group: [],
    node: [],
  };

  allNodes.forEach((node) => {
    const newNode: PositionedNode = {
      ...node,
      x: node.type === "root" ? centerX : 0,
      y: node.type === "root" ? centerY : 0,
      startAngle: 0,
      endAngle: 0,
    };

    nodesByType[node.type]?.push(newNode);
    nodesById[node.id] = newNode;

    if (node.group_id && !groupSizeById[node.group_id]) {
      groupSizeById[node.group_id] = {
        count: 1,
        ids: [node.id],
      };
    } else if (node.group_id && groupSizeById[node.group_id]) {
      groupSizeById[node.group_id].count += 1;
      groupSizeById[node.group_id].ids.push(node.id);
    } else if (node.group_id === null) {
      return;
    } else {
      console.error("SOMETHING WENT WRONG IN POSGRAPHELS");
    }
  });

  // validation ***************************************************************
  // if (!rootNode || rootNode.length !== 1) {
  //   console.error("UNINTENDED - NO ROOT OR TOO MANY ROOTS (initPosFunc)");
  //   return;
  // }
  // if (!rootGroups || rootGroups.length === 0) {
  //   console.error("UNINTENDED - NO ROOT GROUPS FOUND (initPosFunc)");
  //   return rootNode; // new accounts will have a rootNode still
  // }
  // if (rootGroups.length > MAX_ROOT_GROUPS) {
  //   console.error("UNINTENDED - TOO MANY ROOT GROUPS (initPosFunc)");
  //   return rootNode; // new accounts will have a rootNode still
  // }
  // if (!nodes || nodes.length === 0) {
  //   console.error("USER HAS NOT ADDED NODES YET (initPosFunc)");
  //   return rootNode; // new accounts will have a rootNode still
  // }
  // if (nodes.length > MAX_NODES) {
  //   console.error("TOO MANY NODES (initPosFunc)");
  //   return rootNode; // new accounts will have a rootNode still
  // }
  // ***************************************************************************

  // Position root groups
  const angleStep = (2 * Math.PI) / nodesByType.root_group.length;
  nodesByType.root_group.forEach((group, index) => {
    const angle = index * angleStep - Math.PI / 2;
    group.x = centerX + radius * Math.cos(angle);
    group.y = centerY + radius * Math.sin(angle);
    group.startAngle = angle;
    group.endAngle = angle + angleStep;
  });

  // Position nodes within groups
  nodesByType.root_group.forEach((group) => {
    const groupNodes = nodesByType.node.filter(
      (node) => node.group_id === group.id,
    );
    const groupSize = groupNodes.length;

    if (groupSize === 0) return;

    const groupCenterAngle = (group.startAngle + group.endAngle) / 2;
    const totalGroupWidth = (groupSize - 1) * NODE_SPACING;
    const startOffset = -totalGroupWidth / 2;

    groupNodes.forEach((node, index) => {
      const offset = startOffset + index * NODE_SPACING;
      const nodeAngle = groupCenterAngle + Math.atan2(offset, radius);

      node.x = centerX + radius * Math.cos(nodeAngle);
      node.y = centerY + radius * Math.sin(nodeAngle);
      node.startAngle = group.startAngle;
      node.endAngle = group.endAngle;
    });
  });

  // Calculate positions for links
  // !TODO: Links from root to root_groups no longer exist
  const positionedLinks: PositionedLink[] = links.map((link) => {
    const sourceIsRootGroup = link.source_type === "root_group";
    let source;
    let target;

    // if link goes from root TO group
    if (link.relation_type === null) {
      source = nodesByType["root"][0];
      target = nodesById[link.target_id];
    } else if (link.relation_type !== null) {
      // if link goes from root_group TO node, set source to root
      if (sourceIsRootGroup) {
        source = nodesByType["root"][0];
        target = nodesById[link.target_id];
      } else {
        source = nodesById[link.source_id];
        target = nodesById[link.target_id];
      }
    }

    return {
      ...link,
      // source_id: source?.id,
      x1: source?.x ?? centerX,
      y1: source?.y ?? centerY,
      x2: target?.x ?? centerX,
      y2: target?.y ?? centerY,
    };
  });

  // remove links to root_groups from root
  const filteredLinks = positionedLinks.filter(
    (link) => link.source_type !== "root",
  );

  console.log(filteredLinks);

  const finalRoot = nodesByType["root"][0];
  const finalNodes = [...nodesByType["node"]];
  const finalGroups = [...nodesByType["root_group"], ...nodesByType["group"]];

  store.dispatch(
    setInitialState({
      root: finalRoot,
      nodes: finalNodes,
      // links: [],
      links: filteredLinks,
      groups: finalGroups,
    }),
  );

  return finalGroups;
}

const linksRef = [
  {
    id: 6,
    relation_type: "friend",
    source_id: 7,
    source_type: "root_group",
    target_id: 2,
    target_type: "node",
    x1: 196.5,
    x2: 255.3572953424443,
    y1: 386.5,
    y2: 284.3421379189429,
  },
  {
    id: 11,
    relation_type: "friend",
    source_id: 7,
    source_type: "root_group",
    target_id: 12,
    target_type: "node",
    x1: 196.5,
    x2: 275.4699959192102,
    y1: 386.5,
    y2: 298.9548702410013,
  },
  {
    id: 7,
    relation_type: "colleague",
    source_id: 8,
    source_type: "root_group",
    target_id: 3,
    target_type: "node",
    x1: 196.5,
    x2: 308.6295632711986,
    y1: 386.5,
    y2: 422.9331036368063,
  },
  {
    id: 8,
    relation_type: "child_parent",
    source_id: 9,
    source_type: "root_group",
    target_id: 4,
    target_type: "node",
    x1: 196.5,
    x2: 196.5,
    y1: 386.5,
    y2: 504.4,
  },
  {
    id: 9,
    relation_type: "classmate",
    source_id: 10,
    source_type: "root_group",
    target_id: 5,
    target_type: "node",
    x1: 196.5,
    x2: 84.37043672880141,
    y1: 386.5,
    y2: 422.9331036368063,
  },
  {
    id: 10,
    relation_type: "virtual",
    source_id: 11,
    source_type: "root_group",
    target_id: 6,
    target_type: "node",
    x1: 196.5,
    x2: 127.20011875471741,
    y1: 386.5,
    y2: 291.11689636319375,
  },
];
