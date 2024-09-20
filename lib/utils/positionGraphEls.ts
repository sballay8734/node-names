import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { store } from "@/store/store";

import { NODE_SPACING_FACTOR } from "../constants/styles";
import {
  PositionedLink,
  PositionedNode,
  RawLink,
  RawNode,
} from "../types/graph";
import { WindowSize } from "../types/misc";

// REMOVE: should be passed eventually
const userId = 1;

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
    }),
  );

  return { data: { nodes: combined, links: positionedLinks } };
}

const testPreAdd = {
  "1": {
    angle: 0,
    depth: 1,
    group_id: null,
    group_name: "Root",
    id: 1,
    isRoot: true,
    isShown: true,
    name: "Root",
    node_status: "active",
    source_type: null,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  "10": {
    angle: 2.199114857512855,
    depth: 2,
    group_id: null,
    group_name: "School",
    id: 10,
    isRoot: false,
    isShown: true,
    name: "School",
    node_status: "inactive",
    source_type: "root",
    type: "group",
    x: 166.47005146037756,
    y: 427.83267824261605,
  },
  "11": {
    angle: 3.4557519189487724,
    depth: 2,
    group_id: null,
    group_name: "Online",
    id: 11,
    isRoot: false,
    isShown: true,
    name: "Online",
    node_status: "active",
    source_type: "root",
    type: "group",
    x: 147.9105225824806,
    y: 370.71232175738396,
  },
  "12": {
    angle: -1.361356816555577,
    depth: 3,
    group_id: 7,
    group_name: "Friends",
    id: 12,
    isRoot: false,
    isShown: true,
    name: "Donnie",
    node_status: "inactive",
    source_type: "group",
    type: "node",
    x: 217.29116908177593,
    y: 237.5952399266194,
  },
  "2": {
    angle: -1.7802358370342162,
    depth: 3,
    group_id: 7,
    group_name: "Friends",
    id: 2,
    isRoot: false,
    isShown: true,
    name: "Aaron",
    node_status: "inactive",
    source_type: "group",
    type: "node",
    x: 175.70883091822407,
    y: 237.5952399266194,
  },
  "3": {
    angle: -0.31415926535897887,
    depth: 3,
    group_id: 8,
    group_name: "Work",
    id: 3,
    isRoot: false,
    isShown: true,
    name: "Beth",
    node_status: "inactive",
    source_type: "group",
    type: "node",
    x: 340.19512904703475,
    y: 339.81062231988926,
  },
  "4": {
    angle: 0.9424777960769376,
    depth: 3,
    group_id: 9,
    group_name: "Family",
    id: 4,
    isRoot: false,
    isShown: true,
    name: "Carol",
    node_status: "inactive",
    source_type: "group",
    type: "node",
    x: 285.3084737688698,
    y: 508.7343776801108,
  },
  "5": {
    angle: 2.199114857512855,
    depth: 3,
    group_id: 10,
    group_name: "School",
    id: 5,
    isRoot: false,
    isShown: true,
    name: "Diana",
    node_status: "inactive",
    source_type: "group",
    type: "node",
    x: 107.69152623113027,
    y: 508.7343776801108,
  },
  "6": {
    angle: -2.8274333882308142,
    depth: 3,
    group_id: 11,
    group_name: "Online",
    id: 6,
    isRoot: false,
    isShown: true,
    name: "Ethan",
    node_status: "inactive",
    source_type: "group",
    type: "node",
    x: 52.804870952965246,
    y: 339.81062231988926,
  },
  "7": {
    angle: -1.5707963267948966,
    depth: 2,
    group_id: null,
    group_name: "Friends",
    id: 7,
    isRoot: false,
    isShown: true,
    name: "Friends",
    node_status: "inactive",
    source_type: "root",
    type: "group",
    x: 196.5,
    y: 335.40999999999997,
  },
  "8": {
    angle: -0.3141592653589793,
    depth: 2,
    group_id: null,
    group_name: "Work",
    id: 8,
    isRoot: false,
    isShown: true,
    name: "Work",
    node_status: "inactive",
    source_type: "root",
    type: "group",
    x: 245.0894774175194,
    y: 370.71232175738396,
  },
  "9": {
    angle: 0.9424777960769379,
    depth: 2,
    group_id: null,
    group_name: "Family",
    id: 9,
    isRoot: false,
    isShown: true,
    name: "Family",
    node_status: "inactive",
    source_type: "root",
    type: "group",
    x: 226.52994853962247,
    y: 427.83267824261605,
  },
};
