import * as d3 from "d3";
import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";

import { centerNode } from "@/constants/variables";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

import {
  ILink,
  INode,
  Link,
  PositionedLink,
  SimulationResult,
} from "../types/d3Types";

export function calcPrimaryPositions(
  primaryNodes: Tables<"people">[],
  primaryConnections: Tables<"connections">[],
  windowSize: WindowSize,
  scale: SharedValue<number>,
): SimulationResult {
  // Create a copy of the primary connections & nodes
  const primaryC: Link[] = primaryConnections.map((p) => ({ ...p }));
  const primaryN: INode[] = primaryNodes.map((n) => ({ ...n }));

  // NOTE: x and y positions correspond to center of node NOT top left which is why you don't need to do any radius subtracting
  const rootNode = primaryN.find((p) => p.isRoot === true);
  if (rootNode) {
    (rootNode as INode).fx = centerNode(
      windowSize,
      "root",
      "d3",
      scale,
    ).nodeCenterX;
    (rootNode as INode).fy = centerNode(
      windowSize,
      "root",
      "d3",
      scale,
    ).nodeCenterY;
  }

  // ensure rootNode is always the source
  const positionedLinks: PositionedLink[] = primaryC.map((connection) => {
    if (connection.person_2_id === rootNode?.id) {
      // Swap source and target
      return {
        ...connection,
        strength: 1,
        source: connection.person_2_id,
        target: connection.person_1_id,
      };
    }
    return {
      ...connection,
      strength: 1,
      source: connection.person_1_id,
      target: connection.person_2_id,
    };
  });

  // prepare group centers
  const groupCenters: { [key: string]: { x: number; y: number } } = {};
  const groupCount = new Set(primaryN.map((n) => n.group_id)).size;
  let angle = 0;
  const radius = Math.min(windowSize.width, windowSize.height) / 3;

  primaryN.forEach((node) => {
    if (node.group_id === null) return;

    if (!groupCenters[node.group_id]) {
      // distribute group centers in a circle around the root
      angle += (2 * Math.PI) / groupCount;
      groupCenters[node.group_id] = {
        x: windowSize.windowCenterX + radius * Math.cos(angle),
        y: windowSize.windowCenterY + radius * Math.sin(angle),
      };
    }
  });

  function clusteringForce(alpha: number) {
    primaryN.forEach((node) => {
      if (node.group_id === null || node.isRoot) return;

      const groupCenter = groupCenters[node.group_id];
      node.vx! += (groupCenter.x - node.x!) * alpha * 0.5;
      node.vy! += (groupCenter.y - node.y!) * alpha * 0.5;
    });
  }

  const simulation = d3
    .forceSimulation<INode, ILink>(primaryN)

    // create space around the root node and min space around non-root nodes
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((node) => ((node as INode).isRoot ? 50 : 15))
        .strength(0.5),
    )

    // center nodes around screen center
    .force(
      "center",
      d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    )

    // pull linked nodes closer together
    .force(
      "link",
      d3
        .forceLink<INode, PositionedLink>(positionedLinks)
        .id((link) => link.id)
        .distance((link) => {
          const baseDistance = 150;
          return baseDistance * (1 / link.strength);
        })
        .strength((link) => link.strength),
    )

    // weak repulsion force
    .force("charge", d3.forceManyBody().strength(-30))

    .force("clustering", clusteringForce);

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return { nodes: primaryN, links: positionedLinks as ILink[] };
}
