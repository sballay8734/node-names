import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { store } from "@/store/store";

import {
  PositionedGroup,
  PositionedLink,
  PositionedNode,
  RawGroup,
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

  // Calculate the radius of the circle (use 90% of the smaller dimension)
  const radius = Math.min(width, height) * 0.3;

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

  // Calculate position of ONLY the nodes who's source is a rootGroupNode
  function getPersonPosition(node: RawNode): PositionedNode {
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
    // get position of group in order to position node
    const groupPos = rootGroupPositions[node.group_id];
    if (!groupPos) {
      console.log(`No position found for group ${node.group_id}`);
      return { ...node, angle: 0, x: centerX, y: centerY };
    }
    // Position people radially outward from the group's position
    // REMOVE: shouldn't be a hardcoded value here
    const distanceFromGroup = 100;
    return {
      ...node,
      angle: groupPos.angle,
      x: groupPos.x + distanceFromGroup * Math.cos(groupPos.angle),
      y: groupPos.y + distanceFromGroup * Math.sin(groupPos.angle),
    };
  }

  const positionedNonGroupNodes: PositionedNode[] = nonGroupNodes.map(
    (node) => ({
      ...getPersonPosition(node),
    }),
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
