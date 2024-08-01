import * as d3 from "d3";
import { SharedValue } from "react-native-reanimated";

import { centerNode } from "@/constants/variables";
import { INode2 } from "@/features/Graph/redux/graphManagement";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

export interface IPositionedNode extends d3.SimulationNodeDatum, INode2 {}

export interface IPositionedLink
  extends d3.SimulationLinkDatum<IPositionedNode> {
  created_at: string;
  id: number;
  relationship_type: string;
  strength: number;
}

export function calcNodePositions(
  people: Tables<"people">[],
  connections: Tables<"connections">[],
  windowSize: WindowSize,
  scale: SharedValue<number>,
): { nodes: IPositionedNode[]; links: IPositionedLink[] } {
  // make copy of nodes and links
  const positionedNodes: IPositionedNode[] = people.map((p) => ({ ...p }));
  const connectionsCopy: Tables<"connections">[] = connections.map((c) => ({
    ...c,
  }));

  const rootNode = positionedNodes.find((p) => !p.source_node_ids);

  if (rootNode) {
    (rootNode as IPositionedNode).fx = centerNode(
      windowSize,
      "root",
      "d3",
      scale,
    ).nodeCenterX;
    (rootNode as IPositionedNode).fy = centerNode(
      windowSize,
      "root",
      "d3",
      scale,
    ).nodeCenterY;
  }

  const positionedLinks: IPositionedLink[] = connectionsCopy.map(
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
  const radius = Math.min(windowSize.width, windowSize.height) / 3;

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
    positionedNodes.forEach((node: IPositionedNode) => {
      if (node.group_id === null) return;

      const groupCenter = groupCenters[node.group_id];
      node.vx! += (groupCenter.x - node.x!) * alpha * 0.5;
      node.vy! += (groupCenter.y - node.y!) * alpha * 0.5;
    });
  }

  const simulation = d3
    .forceSimulation<IPositionedNode, IPositionedLink>(positionedNodes)

    // create space around the root node and min space around non-root nodes
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((node) =>
          !(node as IPositionedNode).source_node_ids ? 50 : 15,
        )
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
        .forceLink<IPositionedNode, IPositionedLink>(positionedLinks)
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
    vx: -0.030938623229578712,
    vy: -0.009819350470518967,
    x: 251.19960707758767,
    y: 526.793273183848,
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
      vx: -0.030801369338344584,
      vy: -0.008040950088883529,
      x: 112.2880757226056,
      y: 458.6608181819479,
    },
  },
];
