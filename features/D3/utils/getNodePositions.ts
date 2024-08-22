import * as d3 from "d3";
import { SharedValue } from "react-native-reanimated";

import { centerNode, MIN_SPACE_BETWEEN_NODES } from "@/constants/variables";
import { INode2 } from "@/features/Graph/redux/graphManagement";
import { NodeHashObj } from "@/features/Graph/utils/getShownNodesAndConnections";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

import { PositionedLink, PositionedNode } from "../types/d3Types";

export function calcNodePositions(
  people: Tables<"people">[],
  nodeObj: { [nodeId: number]: NodeHashObj },
  connections: Tables<"connections">[],
  windowSize: WindowSize,
  scale: SharedValue<number>,
  activeRootNode: INode2,
): { nodes: PositionedNode[]; links: PositionedLink[] } {
  // make copy of nodes and links
  const positionedNodes: PositionedNode[] = Object.values(nodeObj).map((p) => {
    return p;
  });
  const connectionsCopy: Tables<"connections">[] = connections.map((c) => ({
    ...c,
  }));

  const rootNode = positionedNodes.find((n) => n.id === activeRootNode.id);

  if (rootNode) {
    (rootNode as PositionedNode).fx = centerNode(
      windowSize,
      "root",
      "d3",
      scale,
    ).nodeCenterX;
    (rootNode as PositionedNode).fy = centerNode(
      windowSize,
      "root",
      "d3",
      scale,
    ).nodeCenterY;
  }

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

  function clusteringForce(alpha: number) {
    positionedNodes.forEach((node: PositionedNode) => {
      if (node.group_id === null) return;

      if (node.group_id === 2) {
        // Best Friends within friends
        const groupCenter = groupCenters[node.group_id];
        node.vx! += (groupCenter.x - node.x!) * alpha * 0.3;
        node.vy! += (groupCenter.y - node.y!) * alpha * 0.3;
      } else {
        const groupCenter = groupCenters[node.group_id];
        node.vx! += (groupCenter.x - node.x!) * alpha * 0.05;
        node.vy! += (groupCenter.y - node.y!) * alpha * 0.05;
      }
    });
  }

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
    .forceSimulation<PositionedNode, PositionedLink>(positionedNodes)
    // .force(
    //   "center",
    //   d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    // )
    .force("customRadial", customRadialForce)
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((node) =>
          (node as PositionedNode).id === activeRootNode.id
            ? 100
            : MIN_SPACE_BETWEEN_NODES,
        )
        .strength(0.3),
    )
    // .force(
    //   "link",
    //   d3
    //     .forceLink<PositionedNode, PositionedLink>(positionedLinks)
    //     .id((link) => link.id)
    //     .distance((link) => {
    //       const baseDistance =
    //         link.relationship_type === "spouse"
    //           ? MIN_SPACE_BETWEEN_NODES
    //           : link.relationship_type === "parent_child_biological"
    //           ? MIN_SPACE_BETWEEN_NODES
    //           : MIN_SPACE_BETWEEN_NODES;

    //       // Get the maximum depth of the two nodes connected by this link
    //       const maxDepth = Math.max(
    //         (link.source as PositionedNode).depth_from_user || 0,
    //         (link.target as PositionedNode).depth_from_user || 0,
    //       );

    //       // Increase the distance based on depth
    //       return baseDistance * (1 + maxDepth * 0.9);
    //     })
    //     .strength((link) =>
    //       link.relationship_type === "spouse"
    //         ? 1
    //         : link.relationship_type === "parent_child_biological"
    //         ? 0.5
    //         : 0.1,
    //     ),
    // )
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength((node) =>
          (node as PositionedNode).id === activeRootNode.id ? 100 : -20,
        ),
    );

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return { nodes: positionedNodes, links: positionedLinks };
}

const nodesAfterCalc = [
  {
    children_details: null,
    created_at: "2024-07-20T14:07:07.332245+00:00",
    date_of_birth: "2000-10-01",
    date_of_death: null,
    depth_from_user: 0,
    first_name: "Shawn",
    fx: 196.5, // MARK
    fy: 386.5, // MARK
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 1,
    index: 0, // MARK
    isShown: true, // MARK
    last_name: "Ballay",
    maiden_name: null,
    parent_details: [[Object], [Object]],
    partner_details: null,
    phonetic_name: "sh AW n",
    preferred_name: null,
    sex: "male",
    shallowest_ancestor: null,
    vx: 0, // MARK
    vy: 0, // MARK
    x: 196.5, // MARK
    y: 386.5, // MARK
  },
  {
    children_details: [[Object]],
    created_at: "2024-07-20T14:08:06.754277+00:00",
    date_of_birth: null,
    date_of_death: null,
    depth_from_user: 1,
    first_name: "Aaron",
    gift_ideas: ["Baby thing1", "Babything2", "Workout app"],
    group_id: 2,
    group_name: "Best Friends",
    id: 2,
    index: 1,
    isShown: true,
    last_name: "Mackenzie",
    maiden_name: null,
    parent_details: [[Object], [Object]],
    partner_details: [[Object], [Object]],
    phonetic_name: "Ah run",
    preferred_name: "Amac",
    sex: "male",
    shallowest_ancestor: 1,
    vx: -0.001366007529848085,
    vy: 0.00038064947584544334,
    x: -471.580414370403,
    y: 408.9424694293023,
  },
];
