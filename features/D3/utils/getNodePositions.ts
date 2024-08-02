import * as d3 from "d3";
import { SharedValue } from "react-native-reanimated";

import { centerNode } from "@/constants/variables";
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
    shownConnections: 13,
    vx: -0.007596746870504859,
    vy: -0.007053214740906269,
    x: 271.31008730089934,
    y: 546.3757763060679,
  },
];

const LINK_SHAPE_DB = [
  {
    created_at: "2024-07-20T14:09:26.741696+00:00",
    id: 1,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 2,
  },
  {
    created_at: "2024-07-20T14:20:22.55563+00:00",
    id: 2,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 3,
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
      shownConnections: 13,
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
      shownConnections: 13,
      vx: -0.012160654104310963,
      vy: -0.001841555377031525,
      x: 88.90104404779075,
      y: 338.10539867974325,
    },
  },
];

const SHAPE_FROM_getConnectionCount = [
  {
    created_at: "2024-07-20T14:26:48.225131+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Mackenzie",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 0,
    id: 13,
    last_name: "Something",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["11", "12"],
    shownConnections: 2,
  },
  {
    created_at: "2024-07-20T14:07:07.332245+00:00",
    date_of_birth: "2000-10-01",
    date_of_death: null,
    first_name: "Shawn",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 0,
    id: 1,
    last_name: "Ballay",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "sh AW n",
    preferred_name: null,
    sex: "male",
    source_node_ids: null,
    shownConnections: 16,
  },
  {
    created_at: "2024-07-20T14:16:38.501838+00:00",
    date_of_birth: "1992-02-15",
    date_of_death: "2024-07-01",
    first_name: "Bob",
    gift_ideas: null,
    group_id: 1,
    group_name: "Friends",
    hiddenConnections: 0,
    id: 6,
    last_name: "Johnson",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "b ah b",
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:13:40.640285+00:00",
    date_of_birth: "1987-06-01",
    date_of_death: "2022-01-01",
    first_name: "Nolast",
    gift_ideas: null,
    group_id: 1,
    group_name: "Friends",
    hiddenConnections: 0,
    id: 5,
    last_name: null,
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T19:35:40.425788+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Cody",
    gift_ideas: null,
    group_id: 2,
    group_name: "Best Friends",
    hiddenConnections: 0,
    id: 19,
    last_name: "Zwier",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: "Code",
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:12:10.751453+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Donnie",
    gift_ideas: null,
    group_id: 2,
    group_name: "Best Friends",
    hiddenConnections: 0,
    id: 3,
    last_name: "Irons",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "dah nee",
    preferred_name: "Don",
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:13:11.728096+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Steve",
    gift_ideas: ["Bachstuff1", "Bachstuff2"],
    group_id: 2,
    group_name: "Best Friends",
    hiddenConnections: 0,
    id: 4,
    last_name: "Smith",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "st EE v",
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:25:46.090227+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Lauren",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 4,
    id: 11,
    last_name: "Something",
    maiden_name: "Mackenzie",
    partner_id: 12,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["2", "11"],
    shownConnections: 1,
  },
  {
    created_at: "2024-07-20T14:26:16.95771+00:00",
    date_of_birth: "1986-11-01",
    date_of_death: null,
    first_name: "Eric",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 1,
    id: 12,
    last_name: "Something",
    maiden_name: null,
    partner_id: 11,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["11"],
    shownConnections: 1,
  },
  {
    created_at: "2024-07-20T14:34:27.214013+00:00",
    date_of_birth: "1989-06-01",
    date_of_death: null,
    first_name: "Carmen",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 1,
    id: 15,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 14,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["2", "11"],
    shownConnections: 4,
  },
  {
    created_at: "2024-07-20T14:34:08.695662+00:00",
    date_of_birth: "1995-12-01",
    date_of_death: null,
    first_name: "Joe",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 0,
    id: 14,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 15,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["2", "11"],
    shownConnections: 4,
  },
  {
    created_at: "2024-07-20T14:24:47.404169+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Rachel",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 1,
    id: 9,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 2,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: "Rach",
    sex: "female",
    source_node_ids: ["2"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:08:06.754277+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Aaron",
    gift_ideas: ["Baby thing1", "Babything2", "Workout app"],
    group_id: 2,
    group_name: "Best Friends",
    hiddenConnections: 4,
    id: 2,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 9,
    partner_type: "spouse",
    phonetic_name: "Ah run",
    preferred_name: "Amac",
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 2,
  },
  {
    created_at: "2024-07-20T19:14:07.652311+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Jeff",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    hiddenConnections: 0,
    id: 18,
    last_name: "Cranfield",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T19:13:48.184445+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Ashley",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    hiddenConnections: 0,
    id: 17,
    last_name: "Cranfield",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T19:13:06.095934+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "John",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    hiddenConnections: 0,
    id: 16,
    last_name: "Cheramie",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:18:29.73753+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Michelle",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    hiddenConnections: 0,
    id: 8,
    last_name: null,
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "m ih - sh EH l",
    preferred_name: null,
    sex: "female",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:17:51.921577+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Drake",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    hiddenConnections: 0,
    id: 7,
    last_name: "Davis",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "dr AI k",
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
    shownConnections: 0,
  },
  {
    created_at: "2024-07-20T14:25:12.091096+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Levi",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    hiddenConnections: 0,
    id: 10,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["2", "9"],
    shownConnections: 0,
  },
];

const ALL_CONNECTIONS_FROM_DB = [
  {
    created_at: "2024-07-20T14:09:26.741696+00:00",
    id: 1,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 2,
  },
  {
    created_at: "2024-07-20T14:20:22.55563+00:00",
    id: 2,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 3,
  },
  {
    created_at: "2024-07-20T14:20:36.040121+00:00",
    id: 3,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 4,
  },
  {
    created_at: "2024-07-20T14:21:02.655177+00:00",
    id: 4,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 5,
  },
  {
    created_at: "2024-07-20T14:21:24.155532+00:00",
    id: 5,
    relationship_type: "sibling",
    source_node_id: 1,
    target_node_id: 6,
  },
  {
    created_at: "2024-07-20T14:21:53.545954+00:00",
    id: 6,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 7,
  },
  {
    created_at: "2024-07-20T14:22:12.272541+00:00",
    id: 7,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 8,
  },
  {
    created_at: "2024-07-20T14:27:54.515567+00:00",
    id: 8,
    relationship_type: "spouse",
    source_node_id: 2,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:29:05.076905+00:00",
    id: 9,
    relationship_type: "parent_child_biological",
    source_node_id: 2,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:29:26.66729+00:00",
    id: 10,
    relationship_type: "parent_child_biological",
    source_node_id: 9,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:31:59.74432+00:00",
    id: 11,
    relationship_type: "sibling",
    source_node_id: 2,
    target_node_id: 11,
  },
  {
    created_at: "2024-07-20T14:32:56.744166+00:00",
    id: 12,
    relationship_type: "spouse",
    source_node_id: 11,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:33:21.969605+00:00",
    id: 13,
    relationship_type: "parent_child_biological",
    source_node_id: 11,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:33:35.881146+00:00",
    id: 14,
    relationship_type: "parent_child_biological",
    source_node_id: 12,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:35:17.465332+00:00",
    id: 15,
    relationship_type: "parent_child_biological",
    source_node_id: 2,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:35:29.28415+00:00",
    id: 16,
    relationship_type: "parent_child_biological",
    source_node_id: 2,
    target_node_id: 15,
  },
  {
    created_at: "2024-07-20T14:35:41.714255+00:00",
    id: 17,
    relationship_type: "parent_child_biological",
    source_node_id: 11,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:35:52.933909+00:00",
    id: 18,
    relationship_type: "parent_child_biological",
    source_node_id: 11,
    target_node_id: 15,
  },
  {
    created_at: "2024-07-20T14:36:41.567854+00:00",
    id: 19,
    relationship_type: "grandparent_grandchild",
    source_node_id: 14,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:36:53.281104+00:00",
    id: 20,
    relationship_type: "grandparent_grandchild",
    source_node_id: 15,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:38:57.003102+00:00",
    id: 21,
    relationship_type: "parent_child_in_law",
    source_node_id: 14,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:39:06.626076+00:00",
    id: 22,
    relationship_type: "parent_child_in_law",
    source_node_id: 15,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:39:20.171124+00:00",
    id: 23,
    relationship_type: "parent_child_in_law",
    source_node_id: 14,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:39:29.646034+00:00",
    id: 24,
    relationship_type: "parent_child_in_law",
    source_node_id: 15,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:39:52.841548+00:00",
    id: 25,
    relationship_type: "sibling_in_law",
    source_node_id: 2,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:40:44.864689+00:00",
    id: 26,
    relationship_type: "grandparent_grandchild",
    source_node_id: 14,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:40:54.2034+00:00",
    id: 27,
    relationship_type: "grandparent_grandchild",
    source_node_id: 15,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:41:35.533862+00:00",
    id: 28,
    relationship_type: "niece_nephew_by_blood",
    source_node_id: 13,
    target_node_id: 2,
  },
  {
    created_at: "2024-07-20T14:42:59.654936+00:00",
    id: 29,
    relationship_type: "niece_nephew_by_marriage",
    source_node_id: 13,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:43:41.221945+00:00",
    id: 30,
    relationship_type: "niece_nephew_by_blood",
    source_node_id: 11,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:43:52.452217+00:00",
    id: 31,
    relationship_type: "niece_nephew_by_marriage",
    source_node_id: 12,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T19:15:06.726173+00:00",
    id: 32,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 17,
  },
  {
    created_at: "2024-07-20T19:15:50.777921+00:00",
    id: 34,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 18,
  },
  {
    created_at: "2024-07-20T19:36:25.528396+00:00",
    id: 35,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 19,
  },
  {
    created_at: "2024-07-24T22:14:14.394002+00:00",
    id: 36,
    relationship_type: "spouse",
    source_node_id: 15,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T19:15:29.675303+00:00",
    id: 33,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 16,
  },
];
