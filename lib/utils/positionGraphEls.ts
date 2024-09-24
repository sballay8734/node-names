import { newSetInitialState } from "@/features/Graph/redux/graphSlice";
import { store } from "@/store/store";

import { REG_NODE_RADIUS } from "../constants/styles";
import {
  LinkStatus,
  PositionedNode,
  RawLink,
  RawNode,
  UiLink,
  UiNode,
} from "../types/graph";
import { WindowSize } from "../types/misc";

export interface NodeHash {
  [key: number]: UiNode;
}
export interface LinkHash {
  [key: number]: UiLink;
}

export type SourceHash = Record<number, number[]>;

// REMOVE: should be passed eventually
const userId = 1;
const MAX_ROOT_GROUPS = 7;
const MAX_NODES = 1000;
const RADIUS_FACTOR = 0.3;
const PADDING = 5;
const NODE_SPACING = REG_NODE_RADIUS;
export const CIRCLE_RADIUS = 60;

export function newNewPosFunc(
  allNodes: RawNode[],
  allLinks: RawLink[],
  windowSize: WindowSize,
) {
  // get window dimensions and center point
  const { width, height } = windowSize;
  const centerX = width / 2;
  const centerY = height / 2;
  // const radius = Math.min(width, height);
  const radius = CIRCLE_RADIUS;

  // hashes
  const nodesById: NodeHash = {};
  const linksBySourceId: SourceHash = {};
  const linksByTargetId: SourceHash = {};
  const linksById: LinkHash = {};
  let initActiveRootId: number | null = null;

  // id arrays
  const nodeIds: number[] = [];
  const linkIds: number[] = [];
  const deepGroupIds: number[] = [];
  const rootGroupIds: number[] = [];
  const sourceIds: number[] = []; // REVIEW: Might not need this
  const targetIds: number[] = []; // REVIEW: Might not need this

  function addNodeToHash(node: RawNode) {
    if (!nodesById[node.id]) {
      const newNode: UiNode = {
        ...node,
        startAngle: 0,
        endAngle: 0,
        x: centerX,
        y: centerY,

        // REVIEW: these properties are for initial render only
        isRoot: node.depth === 1,
        isShown: true,
        node_status: node.depth === 1 ? true : false,
      };
      nodesById[node.id] = newNode;
      nodeIds.push(node.id);

      if (node.depth === 1) {
        initActiveRootId = newNode.id;
      }
    }
  }

  function updateLinkHashes(link: RawLink) {
    // add sources to sources hash
    if (!linksBySourceId[link.source_id]) {
      linksBySourceId[link.source_id] = [link.target_id];
    } else {
      linksBySourceId[link.source_id].push(link.target_id);
    }

    // add targets to target hash
    if (!linksByTargetId[link.target_id]) {
      linksByTargetId[link.target_id] = [link.source_id];
    } else {
      linksByTargetId[link.target_id].push(link.source_id);
    }

    if (!linkIds.includes(link.id)) {
      linkIds.push(link.id);
    }

    if (!sourceIds.includes(link.source_id)) {
      sourceIds.push(link.source_id);
    }
    if (!targetIds.includes(link.target_id)) {
      targetIds.push(link.target_id);
    }

    if (!linksById[link.id]) {
      linksById[link.id] = {
        ...link,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        link_status: false,
      };
    }
  }

  function positionRootGroupsAndNodes(nodesHash: NodeHash) {
    const rootGroups = Object.values(nodesHash).filter(
      (node: PositionedNode) => node.type === "root_group",
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

      positionNodesInGroup(root_group);
    });
  }

  function positionNodesInGroup(root_group: UiNode) {
    const sourceGroup = linksBySourceId[root_group.id];
    if (!sourceGroup) return;

    const nodesInGroup: UiNode[] = Object.values(nodesById).filter(
      (node: UiNode) => node.group_id === root_group.id,
    );

    const groupSize = linksBySourceId[root_group.id].length;
    const groupCenterAngle = (root_group.startAngle + root_group.endAngle) / 2;
    const totalGroupWidth = (groupSize - 1) * NODE_SPACING;
    const startOffset = -totalGroupWidth / 2;

    nodesInGroup.forEach((node: PositionedNode, index) => {
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
        node_status: root_group.node_status ? true : false,
      };
    });

    nodesById[root_group.id] = root_group;

    if (rootGroupIds.length >= 7) {
      console.error("7 is the maxium amount of root groups");
      return;
    }

    if (!rootGroupIds.includes(root_group.id)) {
      rootGroupIds.push(root_group.id);
    }
  }

  function positionLink(link_id: number) {
    const link = linksById[link_id];
    const sourceStatus: LinkStatus = nodesById[link.source_id].node_status;

    const linkStatus: LinkStatus = sourceStatus === true ? true : false;

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

  // loop through nodes and links and add them to hash for easy access
  allNodes.forEach((node) => addNodeToHash(node));
  allLinks.forEach((link) => updateLinkHashes(link));
  positionRootGroupsAndNodes(nodesById);
  linkIds.forEach((id) => positionLink(id));

  store.dispatch(
    newSetInitialState({
      nodesById,
      nodeIds,
      linkIds,
      linksById,
      linksBySourceId,
      linksByTargetId,
      rootGroupIds,
      initActiveRootId,
    }),
  );
}
