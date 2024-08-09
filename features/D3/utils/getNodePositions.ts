import * as d3 from "d3";
import { SharedValue } from "react-native-reanimated";

import { centerNode } from "@/constants/variables";
import { INode2 } from "@/features/Graph/redux/graphManagement";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

import { PositionedLink, PositionedNode } from "../types/d3Types";

export interface EnhancedPerson extends Tables<"people"> {
  shownConnections: number;
  hiddenConnections: number;
}

export function calcNodePositions(
  people: EnhancedPerson[],
  connections: Tables<"connections">[],
  windowSize: WindowSize,
  scale: SharedValue<number>,
  activeRootNode: INode2,
): { nodes: PositionedNode[]; links: PositionedLink[] } {
  // make copy of nodes and links
  const positionedNodes: PositionedNode[] = people.map((p) => ({
    ...p,
  }));
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
  const groupCount = new Set(people.map((p) => p.group_id)).size;
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

      const groupCenter = groupCenters[node.group_id];
      node.vx! += (groupCenter.x - node.x!) * alpha * 0.05;
      node.vy! += (groupCenter.y - node.y!) * alpha * 0.05;
    });
  }

  function familyForce(alpha: number) {
    const families: { [famId: string]: PositionedNode[] } = {};
    positionedNodes.forEach((node) => {
      if (node.partner_id && node.source_node_ids) {
        const familyId = node.partner_id || node.source_node_ids[0];
        if (!families[familyId]) {
          families[familyId] = [];
        }
        families[familyId].push(node);
      }
    });

    Object.values(families).forEach((familyMembers) => {
      const validFamilyMembers = familyMembers.filter(
        (member) => member.x !== undefined && member.y !== undefined,
      );
      if (validFamilyMembers.length === 0) return;

      const centerX = d3.mean(validFamilyMembers, (d) => d.x ?? 0) ?? 0;
      const centerY = d3.mean(validFamilyMembers, (d) => d.y ?? 0) ?? 0;

      const rootX = rootNode?.x ?? 0;
      const rootY = rootNode?.y ?? 0;

      validFamilyMembers.forEach((member) => {
        if (member.vx === undefined) member.vx = 0;
        if (member.vy === undefined) member.vy = 0;

        const distanceToRoot = Math.sqrt(
          Math.pow(member.x! - rootX, 2) + Math.pow(member.y! - rootY, 2),
        );

        member.vx += (centerX - (member.x ?? 0)) * alpha * 0.5;
        member.vy += (centerY - (member.y ?? 0)) * alpha * 0.5;

        // Apply additional force based on distance to root
        member.vx += ((rootX - member.x!) / distanceToRoot) * alpha;
        member.vy += ((rootY - member.y!) / distanceToRoot) * alpha;
      });
    });
  }

  const simulation = d3
    .forceSimulation<PositionedNode, PositionedLink>(positionedNodes)
    .force(
      "center",
      d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    )
    .force(
      "radial",
      d3.forceRadial(
        radius,
        windowSize.windowCenterX,
        windowSize.windowCenterY,
      ),
    )
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((node) => (!(node as PositionedNode).source_node_ids ? 20 : 20))
        .strength(0.5),
    )
    .force(
      "link",
      d3
        .forceLink<PositionedNode, PositionedLink>(positionedLinks)
        .id((link) => link.id)
        .distance((link) =>
          link.relationship_type === "spouse" ||
          link.relationship_type === "parent_child_biological"
            ? 15
            : 100,
        )
        .strength((link) =>
          link.relationship_type === "spouse" ||
          link.relationship_type === "parent_child_biological"
            ? 0.7
            : 0.1,
        ),
    )
    .force("clustering", clusteringForce)
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength((node) =>
          !(node as PositionedNode).source_node_ids ? 100 : 20,
        ),
    );
  // .force("family", familyForce);

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return { nodes: positionedNodes, links: positionedLinks };
}
