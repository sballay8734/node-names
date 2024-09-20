import { GraphSliceState } from "@/features/Graph/redux/graphSlice";

import { RawNode, UiNode } from "../types/graph";
import { NODE_SPACING_FACTOR } from "../constants/styles";

export interface CreatedNode {
  id: number;
  depth: number;
  name: string;
  group_id: number | null;
  type: "node" | "group";
  group_name: string | null;
  source_type: "node" | "group" | "root" | null;
}

// Helper function to update position of nodes
export function updatePositions(
  state: GraphSliceState,
  sourceNode: UiNode,
  newNode: CreatedNode,
) {
  // get source node position && angle from root
  const { angle, x, y, type, depth, id } = sourceNode;
  // get children of that node (USE CHILD MAP MAYBE?)
  const currentTargets =
    state.links.bySourceId[sourceNode.id] &&
    state.links.bySourceId[sourceNode.id].map((target_id) => {
      return state.nodes.byId[target_id];
    });

  const currentIds = currentTargets.map((tar) => tar.id);

  if (sourceNode.depth === 1) {
    console.warn("Cannot add anything to the root at this time");
    return;
  }

  const initializedNewNode: UiNode = {
    ...(newNode as RawNode),
    isRoot: false,
    node_status: "inactive",
    isShown: true,
    angle: 1,
    x: 100,
    y: 300,
  };

  // how many targets does the source node have?
  const groupSize = currentTargets.length || 0;

  const finalTargets = [...currentTargets, initializedNewNode];

  const updatedTargets = [
    ...finalTargets.map((target, index) => {
      return repositionedNode(sourceNode, target, currentIds, groupSize, index);
    }),
  ];

  return updatedTargets;
}

function repositionedNode(
  sourceNode: UiNode,
  targetNode: UiNode,
  oldIds: number[],
  groupSize: number,
  nodeIndex: number,
): UiNode {
  // const { angle, x, y, type, depth, id } = sourceNode;

  if (oldIds.includes(targetNode.id)) {
    console.log("NOT MOVING THIS NODE", targetNode.id);
    return { ...targetNode };
  } else {
    return {
      ...targetNode,
      angle: sourceNode.angle,
      x: sourceNode.x + 50 * Math.cos(sourceNode.angle),
      y: sourceNode.y + 50 * Math.sin(sourceNode.angle),
    };
  }
}
