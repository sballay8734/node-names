import * as d3 from "d3";
import { SharedValue } from "react-native-reanimated";

import { centerNode } from "@/constants/variables";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

export interface IPositionedNode
  extends Tables<"people">,
    d3.SimulationNodeDatum {
  vx?: number;
  vy?: number;
}

interface IPositionedLink extends d3.SimulationLinkDatum<IPositionedNode> {
  created_at: string;
  id: number;
  source_node_id: number;
  target_node_id: number;
  relationship_type: string;
  strength: number;
}

export function calcNodePositions(
  people: Tables<"people">[],
  connections: Tables<"connections">[],
  windowSize: WindowSize,
  scale: SharedValue<number>,
): { nodes: IPositionedNode[]; links: IPositionedLink[] } {
  const peopleCopy: Tables<"people">[] = people.map((p) => ({ ...p }));
  const connectionsCopy: Tables<"connections">[] = connections.map((c) => ({
    ...c,
  }));

  const rootNode = peopleCopy.find((p) => !p.source_node_ids);
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
      return {
        ...connection,
        strength: 1,
        source: connection.source_node_id,
        target: connection.target_node_id,
      };
    },
  );

  console.log("LINKS:", positionedLinks);

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
    people.forEach((node) => {
      if (node.group_id === null) return;

      const groupCenter = groupCenters[node.group_id];
      node.vx! += (groupCenter.x - node.x!) * alpha * 0.5;
      node.vy! += (groupCenter.y - node.y!) * alpha * 0.5;
    });
  }

  const simulation = d3
    .forceSimulation<IPositionedNode, IPositionedLink>(peopleCopy)

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

  return { nodes: peopleCopy, links: positionedLinks };
}

const test = [
  {
    created_at: "2024-07-20T14:09:26.741696+00:00",
    id: 1,
    relationship_type: "friend",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 2,
    target_node_id: 2,
  },
  {
    created_at: "2024-07-20T14:20:22.55563+00:00",
    id: 2,
    relationship_type: "friend",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 3,
    target_node_id: 3,
  },
  {
    created_at: "2024-07-20T14:20:36.040121+00:00",
    id: 3,
    relationship_type: "friend",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 4,
    target_node_id: 4,
  },
  {
    created_at: "2024-07-20T14:21:02.655177+00:00",
    id: 4,
    relationship_type: "friend",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 5,
    target_node_id: 5,
  },
  {
    created_at: "2024-07-20T14:21:24.155532+00:00",
    id: 5,
    relationship_type: "sibling",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 6,
    target_node_id: 6,
  },
  {
    created_at: "2024-07-20T14:21:53.545954+00:00",
    id: 6,
    relationship_type: "coworker",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 7,
    target_node_id: 7,
  },
  {
    created_at: "2024-07-20T14:22:12.272541+00:00",
    id: 7,
    relationship_type: "coworker",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 8,
    target_node_id: 8,
  },
  {
    created_at: "2024-07-20T14:27:54.515567+00:00",
    id: 8,
    relationship_type: "spouse",
    source: 2,
    source_node_id: 2,
    strength: 1,
    target: 9,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:29:05.076905+00:00",
    id: 9,
    relationship_type: "parent_child_biological",
    source: 2,
    source_node_id: 2,
    strength: 1,
    target: 10,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:29:26.66729+00:00",
    id: 10,
    relationship_type: "parent_child_biological",
    source: 9,
    source_node_id: 9,
    strength: 1,
    target: 10,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:31:59.74432+00:00",
    id: 11,
    relationship_type: "sibling",
    source: 2,
    source_node_id: 2,
    strength: 1,
    target: 11,
    target_node_id: 11,
  },
  {
    created_at: "2024-07-20T14:32:56.744166+00:00",
    id: 12,
    relationship_type: "spouse",
    source: 11,
    source_node_id: 11,
    strength: 1,
    target: 12,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:33:21.969605+00:00",
    id: 13,
    relationship_type: "parent_child_biological",
    source: 11,
    source_node_id: 11,
    strength: 1,
    target: 13,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:33:35.881146+00:00",
    id: 14,
    relationship_type: "parent_child_biological",
    source: 12,
    source_node_id: 12,
    strength: 1,
    target: 13,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:35:17.465332+00:00",
    id: 15,
    relationship_type: "parent_child_biological",
    source: 2,
    source_node_id: 2,
    strength: 1,
    target: 14,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:35:29.28415+00:00",
    id: 16,
    relationship_type: "parent_child_biological",
    source: 2,
    source_node_id: 2,
    strength: 1,
    target: 15,
    target_node_id: 15,
  },
  {
    created_at: "2024-07-20T14:35:41.714255+00:00",
    id: 17,
    relationship_type: "parent_child_biological",
    source: 11,
    source_node_id: 11,
    strength: 1,
    target: 14,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:35:52.933909+00:00",
    id: 18,
    relationship_type: "parent_child_biological",
    source: 11,
    source_node_id: 11,
    strength: 1,
    target: 15,
    target_node_id: 15,
  },
  {
    created_at: "2024-07-20T14:36:41.567854+00:00",
    id: 19,
    relationship_type: "grandparent_grandchild",
    source: 14,
    source_node_id: 14,
    strength: 1,
    target: 13,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:36:53.281104+00:00",
    id: 20,
    relationship_type: "grandparent_grandchild",
    source: 15,
    source_node_id: 15,
    strength: 1,
    target: 13,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:38:57.003102+00:00",
    id: 21,
    relationship_type: "parent_child_in_law",
    source: 14,
    source_node_id: 14,
    strength: 1,
    target: 9,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:39:06.626076+00:00",
    id: 22,
    relationship_type: "parent_child_in_law",
    source: 15,
    source_node_id: 15,
    strength: 1,
    target: 9,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:39:20.171124+00:00",
    id: 23,
    relationship_type: "parent_child_in_law",
    source: 14,
    source_node_id: 14,
    strength: 1,
    target: 12,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:39:29.646034+00:00",
    id: 24,
    relationship_type: "parent_child_in_law",
    source: 15,
    source_node_id: 15,
    strength: 1,
    target: 12,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:39:52.841548+00:00",
    id: 25,
    relationship_type: "sibling_in_law",
    source: 2,
    source_node_id: 2,
    strength: 1,
    target: 12,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:40:44.864689+00:00",
    id: 26,
    relationship_type: "grandparent_grandchild",
    source: 14,
    source_node_id: 14,
    strength: 1,
    target: 10,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:40:54.2034+00:00",
    id: 27,
    relationship_type: "grandparent_grandchild",
    source: 15,
    source_node_id: 15,
    strength: 1,
    target: 10,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:41:35.533862+00:00",
    id: 28,
    relationship_type: "niece_nephew_by_blood",
    source: 13,
    source_node_id: 13,
    strength: 1,
    target: 2,
    target_node_id: 2,
  },
  {
    created_at: "2024-07-20T14:42:59.654936+00:00",
    id: 29,
    relationship_type: "niece_nephew_by_marriage",
    source: 13,
    source_node_id: 13,
    strength: 1,
    target: 9,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:43:41.221945+00:00",
    id: 30,
    relationship_type: "niece_nephew_by_blood",
    source: 11,
    source_node_id: 11,
    strength: 1,
    target: 10,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:43:52.452217+00:00",
    id: 31,
    relationship_type: "niece_nephew_by_marriage",
    source: 12,
    source_node_id: 12,
    strength: 1,
    target: 10,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T19:15:06.726173+00:00",
    id: 32,
    relationship_type: "coworker",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 17,
    target_node_id: 17,
  },
  {
    created_at: "2024-07-20T19:15:50.777921+00:00",
    id: 34,
    relationship_type: "coworker",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 18,
    target_node_id: 18,
  },
  {
    created_at: "2024-07-20T19:36:25.528396+00:00",
    id: 35,
    relationship_type: "friend",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 19,
    target_node_id: 19,
  },
  {
    created_at: "2024-07-24T22:14:14.394002+00:00",
    id: 36,
    relationship_type: "spouse",
    source: 15,
    source_node_id: 15,
    strength: 1,
    target: 14,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T19:15:29.675303+00:00",
    id: 33,
    relationship_type: "coworker",
    source: 1,
    source_node_id: 1,
    strength: 1,
    target: 16,
    target_node_id: 16,
  },
];
