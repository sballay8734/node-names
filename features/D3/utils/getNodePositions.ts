import * as d3 from "d3";
import { SharedValue } from "react-native-reanimated";

import { centerNode } from "@/constants/variables";
import { EnhancedPerson } from "@/features/Graph/utils/getNthConnections";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

import { PositionedLink, PositionedNode } from "../types/d3Types";

export function calcNodePositions(
  people: EnhancedPerson[],
  connections: Tables<"connections">[],
  windowSize: WindowSize,
  scale: SharedValue<number>,
): { nodes: PositionedNode[]; links: PositionedLink[] } {
  // make copy of nodes and links
  const positionedNodes: PositionedNode[] = people.map((p) => ({
    ...p,
  }));
  const connectionsCopy: Tables<"connections">[] = connections.map((c) => ({
    ...c,
  }));

  const rootNode = positionedNodes.find((p) => !p.source_node_ids);

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

  // console.log("NODES:", positionedNodes);
  // console.log("\n\n\n");
  // console.log("LINKS:", positionedLinks);

  return { nodes: positionedNodes, links: positionedLinks };
}

// REMOVE: Just for reference
const FINAL_NODE_SHAPE = [
  {
    created_at: "2024-07-20T14:16:38.501838+00:00",
    date_of_birth: "1992-02-15",
    date_of_death: "2024-07-01",
    first_name: "Bob",
    gift_ideas: null,
    group_id: 1,
    group_name: "Friends",
    hiddenConnections: 2,
    id: 6,
    index: 0,
    last_name: "Johnson",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "b ah b",
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
    totalConnections: 13,
    vx: -0.007596746870504859,
    vy: -0.007053214740906269,
    x: 271.31008730089934,
    y: 546.3757763060679,
  },
];

const FINAL_LINK_SHAPE = [
  {
    created_at: "2024-07-20T14:09:26.741696+00:00",
    id: 1,
    index: 0,
    relationship_type: "friend",
    source: {
      created_at: "2024-07-20T14:07:07.332245+00:00",
      date_of_birth: "2000-10-01",
      date_of_death: null,
      first_name: "Shawn",
      fx: 196.5,
      fy: 386.5,
      gift_ideas: null,
      group_id: null,
      group_name: null,
      hiddenConnections: 0,
      id: 1,
      index: 13,
      last_name: "Ballay",
      maiden_name: null,
      partner_id: null,
      partner_type: null,
      phonetic_name: "sh AW n",
      preferred_name: null,
      sex: "male",
      source_node_ids: null,
      totalConnections: 13,
      vx: 0,
      vy: 0,
      x: 196.5,
      y: 386.5,
    },
    strength: 1,
    target: {
      created_at: "2024-07-20T14:08:06.754277+00:00",
      date_of_birth: null,
      date_of_death: null,
      first_name: "Aaron",
      gift_ideas: [Array],
      group_id: 2,
      group_name: "Best Friends",
      hiddenConnections: 2,
      id: 2,
      index: 5,
      last_name: "Mackenzie",
      maiden_name: null,
      partner_id: 9,
      partner_type: "spouse",
      phonetic_name: "Ah run",
      preferred_name: "Amac",
      sex: "male",
      source_node_ids: [Array],
      totalConnections: 13,
      vx: -0.012160654104310963,
      vy: -0.001841555377031525,
      x: 88.90104404779075,
      y: 338.10539867974325,
    },
  },
];
