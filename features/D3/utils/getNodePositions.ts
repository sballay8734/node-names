import * as d3 from "d3";
import { SharedValue } from "react-native-reanimated";

import { MIN_SPACE_BETWEEN_NODES } from "@/constants/variables";
import { NodeHashObj } from "@/features/Graph/utils/getInitialNodes";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

import { PositionedLink, PositionedNode } from "../types/d3Types";

export function calcNodePositions(
  people: Tables<"people">[],
  nodeObj: { [nodeId: number]: NodeHashObj },
  connections: Tables<"connections">[],
  windowSize: WindowSize,
  scale: SharedValue<number>,
): { nodes: PositionedNode[]; links: PositionedLink[] } {
  // console.log("GETTING NODE POS");
  // make copy of nodes and links
  const positionedNodes: PositionedNode[] = Object.values(nodeObj).map((p) => {
    return p;
  });
  const connectionsCopy: Tables<"connections">[] = connections.map((c) => ({
    ...c,
  }));

  const positionedLinks: PositionedLink[] = connectionsCopy.map(
    (connection) => {
      const { source_node_id, target_node_id, ...rest } = connection;
      return {
        ...rest,
        strength: 1,
        source: connection.source_node_id,
        target: connection.target_node_id,
      };
    },
  );

  // prepare group centers
  const groupCenters: { [key: string]: { x: number; y: number } } = {};
  const groupCount = new Set(
    people.map((p) => p.group_id).filter((i) => i !== null),
  ).size;
  let angle = 0;
  const radius = Math.min(windowSize.width, windowSize.height) / 2;

  people.forEach((node) => {
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

  const groupRadius = Math.min(windowSize.width, windowSize.height) * 1.5;

  function customRadialForce(alpha: number) {
    positionedNodes.forEach((node: PositionedNode) => {
      if (node.group_id !== null) {
        // For group nodes, position them at a fixed radius
        const angle = (node.group_id / groupCount) * 2 * Math.PI;
        const targetX =
          windowSize.windowCenterX + groupRadius * Math.cos(angle);
        const targetY =
          windowSize.windowCenterY + groupRadius * Math.sin(angle);

        node.vx! += (targetX - node.x!) * alpha * 0.3;
        node.vy! += (targetY - node.y!) * alpha * 0.3;
      } else {
        // For other nodes, use depth_from_user
        const nodeRadius = groupRadius * (1 + node.depth_from_user * 0.2); // Adjust multiplier as needed
        const dx = node.x! - windowSize.windowCenterX;
        const dy = node.y! - windowSize.windowCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          node.vx! += dx * (nodeRadius / distance - 1) * alpha;
          node.vy! += dy * (nodeRadius / distance - 1) * alpha;
        }
      }
    });
  }

  const simulation = d3
    .forceSimulation<PositionedNode>(positionedNodes)
    .force(
      "center",
      d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    )
    .force("customRadial", customRadialForce)
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((node) =>
          (node as PositionedNode).is_current_root
            ? 100
            : MIN_SPACE_BETWEEN_NODES,
        )
        .strength(0.3),
    )
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength((node) =>
          (node as PositionedNode).is_current_root ? 100 : -20,
        ),
    );

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return { nodes: positionedNodes, links: positionedLinks };
}
