import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { store } from "@/store/store";

import { REG_NODE_RADIUS } from "../constants/styles";
import {
  NodeType,
  PositionedLink,
  PositionedNode,
  RawLink,
  RawNode,
} from "../types/graph";
import { WindowSize } from "../types/misc";

interface NodeHash {
  [key: number]: PositionedNode;
}

interface SourceData {
  size: number;
  [key: number]: PositionedNode;
}

type SourceHash = Record<number, SourceData>;

type mapKey = "root" | "root_group" | "group" | "node";

// REMOVE: should be passed eventually
const userId = 1;
const MAX_ROOT_GROUPS = 7;
const MAX_NODES = 1000;
const RADIUS_FACTOR = 0.3;
const PADDING = 5;
const NODE_SPACING = REG_NODE_RADIUS * 2 + PADDING;

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

  // console.log(filteredLinks);

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

export function newNewPosFunc(
  allNodes: RawNode[],
  allLinks: RawLink[],
  windowSize: WindowSize,
) {
  // get window dimensions and center point
  const { width, height } = windowSize;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * RADIUS_FACTOR;

  // hashes
  const nodesById: NodeHash = {};
  const sourceById: SourceHash = {};

  // id arrays
  const nodeIds: number[] = [];
  const linkIds: number[] = [];
  const sourceIds: number[] = []; // REVIEW: Might not need this
  const targetIds: number[] = []; // REVIEW: Might not need this

  function addNodeToHash(node: RawNode) {
    if (!nodesById[node.id]) {
      const newNode: PositionedNode = {
        ...node,
        startAngle: 0,
        endAngle: 0,
        x: centerX,
        y: centerY,
      };
      nodesById[node.id] = newNode;
      nodeIds.push(node.id);
    }
  }

  function addSourceToHash(link: RawLink) {
    const newEntry = { [link.target_id]: nodesById[link.target_id] };

    if (!sourceById[link.source_id]) {
      sourceById[link.source_id] = { size: 1, ...newEntry };
    } else {
      sourceById[link.source_id] = {
        ...sourceById[link.source_id],
        ...newEntry,
      };
      sourceById[link.source_id].size += 1;
    }

    linkIds.push(link.id);

    if (!sourceIds.includes(link.source_id)) {
      sourceIds.push(link.source_id);
    }
    if (!targetIds.includes(link.target_id)) {
      targetIds.push(link.target_id);
    }
  }

  // loop through nodes and links and add them to hash for easy access
  allNodes.forEach((node) => addNodeToHash(node));
  allLinks.forEach((link) => addSourceToHash(link));

  // console.log("NODES:", nodesById);
  console.log("SOURCES:", sourceById);
  // console.log("linkIds:", linkIds);
  // console.log("sourceIds:", sourceIds);
  // console.log("targetIds:", targetIds);
  // console.log("nodeIds:", nodeIds);
}
