import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { store } from "@/store/store";

import { NODE_SPACING_FACTOR } from "../constants/styles";
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

// REMOVE: should be passed eventually
const userId = 1;
const MAX_ROOT_GROUPS = 7;
const MAX_NODES = 1000;
const RADIUS_FACTOR = 0.3;

export function positionGraphEls(
  data: { nodes: RawNode[]; links: RawLink[] },
  windowSize: WindowSize,
): {
  data: {
    nodes: PositionedNode[];
    links: PositionedLink[];
  };
} {
  const width = windowSize.width;
  const height = windowSize.height;
  const { nodes, links } = data;

  // Calculate the center of the circle
  const centerX = width / 2;
  const centerY = height / 2;

  const radius = Math.min(width, height) * 0.13;

  // ** NEWWWWW ***************************************************************
  // initialize and set nodesMap && linksMap
  const nodesMap: { [id: string]: RawNode } = {};
  const linksMap: { [id: string]: RawLink } = {};

  let rootNodeId: number = 0;
  const groupNodeIds: number[] = [];
  const rootGroupNodeIds: number[] = [];
  const nonGroupNodeIds: number[] = [];

  const rootGroupNodes: RawNode[] = [];
  const allGroupNodes: RawNode[] = [];
  const nonGroupNodes: RawNode[] = [];

  nodes.forEach((node) => {
    const type = node.type;
    if (!nodesMap[node.id]) {
      nodesMap[node.id] = {
        ...node,
      };
      // set root node id
      if (node.depth === 1) {
        rootNodeId = node.id;
      }
      if (node.source_type === "root" && !rootGroupNodeIds.includes(node.id)) {
        rootGroupNodes.push(node);
        rootGroupNodeIds.push(node.id);
      }
      if (type === "group" && !groupNodeIds.includes(node.id)) {
        allGroupNodes.push(node);
        groupNodeIds.push(node.id);
      } else if (type === "node" && !nonGroupNodeIds.includes(node.id)) {
        nonGroupNodes.push(node);
        nonGroupNodeIds.push(node.id);
      } else {
        console.error("Something went wrong in postionGraphEls.ts");
      }
    } else {
      console.error("Duplicate node_id found!", node.id);
    }
  });

  const rootNode = nodes.find((node) => node.id === rootNodeId);

  // Create a map to store the root Group positions
  const rootGroupPositions: { [nodeId: number]: PositionedNode } = {};

  // Calculate postions for each ROOT GROUP FIRST
  const positionedRootGroups: PositionedNode[] = rootGroupNodes.map(
    (groupNode, index) => {
      const angleOffset =
        rootGroupNodes.length % 2 === 0 ? Math.PI / rootGroupNodes.length : 0;

      const angle =
        (index / rootGroupNodes.length) * 2 * Math.PI -
        Math.PI / 2 +
        angleOffset;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const updatedNode = {
        ...groupNode,
        angle,
        x,
        y,
      };

      if (!rootGroupPositions[groupNode.id]) {
        rootGroupPositions[groupNode.id] = updatedNode;
      }

      return updatedNode;
    },
  );

  // !TODO: Here is where you will also calc the positions for non-root groups

  function getPersonPosition(
    node: RawNode,
    groupSize: number,
    nodeIndex: number,
  ): PositionedNode {
    if (node.depth === 1) {
      return { ...node, angle: 0, x: centerX, y: centerY }; // Place userNode in center
    }

    if (node.group_id === null) {
      console.warn(
        "There should be no nodes in this function with a group_id equal to null",
        node.id,
      );
      return { ...node, angle: 0, x: centerX, y: centerY };
    }

    // Get position of the group
    const groupPos = rootGroupPositions[node.group_id];
    if (!groupPos || isNaN(groupPos.x) || isNaN(groupPos.y)) {
      console.warn(`No valid position found for group ${node.group_id}`);
      return { ...node, angle: 0, x: centerX, y: centerY }; // Fallback to center position
    }

    // Ensure groupSize is valid and prevent division by zero
    if (groupSize <= 0) {
      console.warn(`Group ${node.group_id} has no valid members or size`);
      return { ...node, angle: 0, x: groupPos.x, y: groupPos.y }; // Fallback to group position
    }

    // Calculate the angle of the group's position relative to the root
    const rootToGroupAngle = Math.atan2(
      groupPos.y - centerY,
      groupPos.x - centerX,
    );

    // Restrict node positions to an arc on the far side of the group
    const arcSpan = (Math.PI / 3) * NODE_SPACING_FACTOR; // 120 degrees in radians

    let angleOffset;

    if (groupSize % 2 === 0) {
      // Even number of nodes: distribute symmetrically
      angleOffset = -arcSpan / 2 + (nodeIndex * arcSpan) / (groupSize - 1); // Prevent division by zero
    } else {
      // Odd number of nodes: center the middle node and distribute others around
      const middleIndex = (groupSize - 1) / 2; // Get the index of the middle node
      angleOffset = ((nodeIndex - middleIndex) * arcSpan) / groupSize; // Symmetric distribution
    }

    // Calculate the final angle for this node
    const nodeAngle = rootToGroupAngle + angleOffset;

    // Set a distance from the group
    const distanceFromGroup = 100;

    // Compute the final position of the node
    const x = groupPos.x + distanceFromGroup * Math.cos(nodeAngle);
    const y = groupPos.y + distanceFromGroup * Math.sin(nodeAngle);

    // Ensure x and y are valid numbers
    if (isNaN(x) || isNaN(y)) {
      console.error(
        `Invalid position calculated for node ${node.id}: x=${x}, y=${y}`,
      );
      return { ...node, angle: 0, x: centerX, y: centerY }; // Fallback position
    }

    return {
      ...node,
      angle: nodeAngle,
      x,
      y,
    };
  }

  // Map over the non-group nodes with updated logic
  const positionedNonGroupNodes: PositionedNode[] = nonGroupNodes.map(
    (node) => {
      const nodesInGroup = nonGroupNodes.filter(
        (n) => n.group_id === node.group_id,
      );
      const groupSize = nodesInGroup.length; // Get group size
      const nodeIndex = nodesInGroup.findIndex((n) => n.id === node.id); // Get node index within group
      return getPersonPosition(node, groupSize, nodeIndex);
    },
  );

  // Calculate positions for links
  // !TODO: THIS NEEDS TO BE FIXED (Does not support NON-ROOT-GroupNodes)
  const positionedLinks: PositionedLink[] = links.map((link) => {
    let source;
    let target;

    // if link goes from node TO group, search groups for the target
    if (link.relation_type === null) {
      source = positionedNonGroupNodes.find(
        (node) => node.id === link.source_id,
      );
      target = positionedRootGroups.find((r) => r.id === link.target_id);
    } else if (link.relation_type !== null) {
      // if link goes from group TO node, search nodes for the target
      source = positionedRootGroups.find((p) => p.id === link.source_id);
      target = positionedNonGroupNodes.find((p) => p.id === link.target_id);
    }
    return {
      ...link,
      x1: source?.x ?? centerX,
      y1: source?.y ?? centerY,
      x2: target?.x ?? centerX,
      y2: target?.y ?? centerY,
    };
  });

  const combined = [...positionedRootGroups, ...positionedNonGroupNodes];

  store.dispatch(
    setInitialState({
      nodes: combined,
      links: positionedLinks,
      groups: [],
    }),
  );

  return { data: { nodes: combined, links: positionedLinks } };
}

export function newINITPosFunc(
  allNodes: RawNode[],
  links: RawLink[],
  windowSize: WindowSize,
) {
  // get window dimensions and center point
  const { width, height } = windowSize;
  const centerX = width / 2;
  const centerY = height / 2;

  const nodeHash: NodeHash = {};
  let rootNode: PositionedNode[] = [];
  let rootGroups: PositionedNode[] = [];
  let deepGroups: PositionedNode[] = [];
  let nodes: PositionedNode[] = [];

  // loop through nodes ONCE and set items instead of filtering 4 times.
  allNodes.forEach((node) => {
    const isRoot = node.type === "root";
    const isRootGroup = node.type === "root_group";
    const isDeepGroup = node.type === "group";
    const isPlainNode = node.type === "node";

    const newNode: PositionedNode = {
      ...node,
      x: isRoot ? centerX : 0,
      y: isRoot ? centerY : 0,
      angle: 0,
    };

    // set root and push nodes to appropriate arrays
    if (isRoot) {
      rootNode.push(newNode);
    } else if (isRootGroup) {
      rootGroups.push(newNode);
    } else if (isDeepGroup) {
      deepGroups.push(newNode);
    } else if (isPlainNode) {
      nodes.push(newNode);
    } else {
      console.error("UNINTENDED - NODE MATCHES ZERO CATEGORIES (initPosFunc)");
    }

    // add node to hash
    if (!nodeHash[node.id]) {
      nodeHash[node.id] = newNode;
    }
  });

  // validation ***************************************************************
  if (!rootNode || rootNode.length !== 1) {
    console.error("UNINTENDED - NO ROOT OR TOO MANY ROOTS (initPosFunc)");
    return;
  }
  if (!rootGroups || rootGroups.length === 0) {
    console.error("UNINTENDED - NO ROOT GROUPS FOUND (initPosFunc)");
    return rootNode; // new accounts will have a rootNode still
  }
  if (rootGroups.length > MAX_ROOT_GROUPS) {
    console.error("UNINTENDED - TOO MANY ROOT GROUPS (initPosFunc)");
    return rootNode; // new accounts will have a rootNode still
  }
  if (!nodes || nodes.length === 0) {
    console.error("USER HAS NOT ADDED NODES YET (initPosFunc)");
    return rootNode; // new accounts will have a rootNode still
  }
  if (nodes.length > MAX_NODES) {
    console.error("TOO MANY NODES (initPosFunc)");
    return rootNode; // new accounts will have a rootNode still
  }
  // ***************************************************************************

  // Calculate angles for groups
  const numGroups = rootGroups.length;
  const angleStep = (2 * Math.PI) / numGroups;

  // Position root groups in a circle around root node
  rootGroups.forEach((group, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = Math.min(width, height) * RADIUS_FACTOR;
    group.x = centerX + radius * Math.cos(angle);
    group.y = centerY + radius * Math.sin(angle);
    group.startAngle = angle;
    group.endAngle = angle + angleStep;
  });

  // Position nodes within their respective groups
  nodes.forEach((node) => {
    const group = rootGroups.find((g) => g.id === node.group_id);
    if (
      group &&
      typeof group.startAngle === "number" &&
      typeof group.endAngle === "number"
    ) {
      const randomAngle =
        group.startAngle + Math.random() * (group.endAngle - group.startAngle);
      const randomRadius = RADIUS_FACTOR * Math.min(width, height);
      node.x = centerX + randomRadius * Math.cos(randomAngle);
      node.y = centerY + randomRadius * Math.sin(randomAngle);
    }
  });

  const finalNodes = [...rootNode, ...nodes];
  const finalGroups = [...rootGroups, ...deepGroups];

  store.dispatch(
    setInitialState({
      nodes: finalNodes,
      links: [],
      groups: finalGroups,
    }),
  );

  return finalGroups;
}

export function updatePosFunc(
  windowSize: WindowSize,
  nodes: UiNode[],
  links: UiLink[],
  newNode: RawNode,
) {
  return null;
}
