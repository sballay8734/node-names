import { PositionedNode } from "@/features/D3/types/d3Types";
import { EnhancedPerson } from "@/features/D3/utils/getNodePositions";
import { Tables } from "@/types/dbTypes";

import {
  getChildrenConAndIds,
  getPartnerConIdsNodes,
  getRootConAndIds,
} from "../helpers/nodesAndConnections";
import { INode2 } from "../redux/graphManagement";

interface INodeObj {
  [id: number]: PositionedNode;
}

interface IConnObj {
  [sourceId: number]: {
    directConns: Tables<"connections">[];
    // directTargetIds: number[];
    currentPartnerId: number | null;
    bioChildrenNodeIds: number[];
  };
}

export function getShownNodesAndConnections(
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  depth: 0 | 1,
  currentRootNode: INode2,
): {
  shownNodes: EnhancedPerson[];
  finalConnections: Tables<"connections">[];
} {
  // NEW vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  const connObj: IConnObj = {};
  const nodeObj: INodeObj = {};

  // !TODO: Loop through people first to get the currentSpouses, partner_details, and kids.

  allConnections.forEach((c) => {
    // if source node id does not exist yet as a key
    if (!connObj[c.source_node_id]) {
      // initialize obj
      connObj[c.source_node_id] = {
        directConns: [],
        // directTargetIds: [],
        currentPartnerId: null,
        bioChildrenNodeIds: [],
      };
      // push current connection id
      connObj[c.source_node_id].directConns.push(c);
      // if the source of the connection already exists as a key
    } else if (connObj[c.source_node_id]) {
      connObj[c.source_node_id].directConns.push(c);
    }
  });

  allPeople.forEach((p) => {
    // if person has direct connections AND has partner details
    if (connObj[p.id] && p.partner_details) {
      p.partner_details.forEach((partner) => {
        if (partner.status === "current") {
          connObj[p.id].currentPartnerId = partner.partner_id;
        }
        if (partner.children_ids) {
          connObj[p.id].bioChildrenNodeIds.push(...partner.children_ids);
        }
      });
    }

    // just used for key look up later
    if (!nodeObj[p.id]) {
      nodeObj[p.id] = {
        ...p,
        hiddenConnections: 0,
        shownConnections: 0,
      };
    }
  });

  let testNodes: EnhancedPerson[] = [];
  let testConns: Tables<"connections">[] = [];

  // based on current root nodeId
  if (connObj[currentRootNode.id]) {
    let connsToAdd: Tables<"connections">[] = [];
    connObj[currentRootNode.id].directConns.forEach((c) => {
      const target = c.target_node_id;
      // if target has kids, add them
      if (
        connObj[target] &&
        connObj[target].bioChildrenNodeIds &&
        connObj[target].bioChildrenNodeIds.length
      ) {
        // get the connections where the target is one of sources children
        const toAdd = connObj[target].directConns.filter((conn) =>
          connObj[target].bioChildrenNodeIds.includes(conn.target_node_id),
        );

        connsToAdd.push(...toAdd);
      }

      // if target has partner, add partner AND // !TODO: spouses conn to child
      if (connObj[target] && connObj[target].currentPartnerId) {
        const toAdd = connObj[target].directConns.filter(
          (conn) => connObj[target].currentPartnerId === conn.target_node_id,
        );

        connsToAdd.push(...toAdd);
      }
    });

    // !TODO: Need to ensure there won't be duplicates here
    // combine connections
    testConns = [...connObj[currentRootNode.id].directConns, ...connsToAdd];

    // using connections, get the nodes needed using target
    testNodes = [
      currentRootNode,
      ...testConns.map((c) => {
        return nodeObj[c.target_node_id];
      }),
    ];
  }

  return { shownNodes: testNodes, finalConnections: testConns };
  // NEW ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // initialze proper shape of nodes
  // const peopleCopy: EnhancedPerson[] = allPeople.map((p) => ({
  //   ...p,
  //   shownConnections: 0,
  //   hiddenConnections: 0,
  // }));

  // let shownConnections: Tables<"connections">[] = [];
  // let hiddenConnections: Tables<"connections">[] = [];

  // // ROOT CONNECTIONS & ROOT TARGETS IDS ***************************************
  // const { rootDirectConnections, directTargetIds } = getRootConAndIds(
  //   allConnections,
  //   currentRootNode.id,
  // );

  // // PARTNER CONNECTIONS, IDS, & NODES *****************************************
  // const {
  //   shownPartnerConnections,
  //   partnerIds,
  //   partnerNodes,
  //   shownPartnerConnectionIds,
  // } = getPartnerConIdsNodes(allConnections, directTargetIds, peopleCopy);

  // // CHILDREN CONNECTIONS & IDS ************************************************
  // const { childrenIds, shownChildrenConnections, shownChildrenConnectionIds } =
  //   getChildrenConAndIds(partnerNodes, allConnections);

  // // COMBINE ALL IDS
  // const combinedShownNodeIds = [
  //   ...directTargetIds,
  //   ...partnerIds,
  //   ...childrenIds,
  //   currentRootNode.id,
  // ];

  // // Combine the ids of all shown connections but NOT targets of rootNode
  // const combinedShownConnectionIds = [
  //   ...shownPartnerConnectionIds,
  //   ...shownChildrenConnectionIds,
  // ];

  // // REMOVE DUPLICATE NODE IDS
  // const uniqueIdsToShow = Array.from(new Set(combinedShownNodeIds));

  // // GET NODES THAT NEED TO BE SHOWN BY USING IDS
  // const shownNodes = peopleCopy.filter((p) => uniqueIdsToShow.includes(p.id));

  // // COMBINE ALL CONNECTIONS
  // shownConnections = [
  //   ...rootDirectConnections,
  //   ...shownPartnerConnections,
  //   ...shownChildrenConnections,
  // ];

  // // Filter out duplicate connections using a Set
  // const seenIds = new Set<number>();
  // const finalConnections = shownConnections.filter((c) => {
  //   if (!seenIds.has(c.id)) {
  //     seenIds.add(c.id);
  //     return true;
  //   }
  //   return false;
  // });

  // // identify hidden connections
  // hiddenConnections = allConnections.filter(
  //   (c) =>
  //     !combinedShownConnectionIds.includes(c.id) &&
  //     c.source_node_id !== currentRootNode.id &&
  //     (!directTargetIds.includes(c.source_node_id) ||
  //       !directTargetIds.includes(c.target_node_id)),
  // );

  // // Update hiddenConnections count for each shown node
  // shownNodes.forEach((node) => {
  //   const hiddenConCount = hiddenConnections.filter(
  //     (c) => c.source_node_id === node.id,
  //   ).length;
  //   node.hiddenConnections = hiddenConCount;
  // });

  // return { shownNodes, finalConnections };
}

// !TODO: incorporate "depth" in the function

const HIDDEN_CONNS = [
  {
    children_ids: ["11", "2"],
    created_at: "2024-07-20T14:34:27.214013+00:00",
    date_of_birth: "1989-06-01",
    date_of_death: null,
    first_name: "Carmen",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 15,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 14,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["2", "11"],
  },
  {
    children_ids: ["10"],
    created_at: "2024-07-20T14:24:47.404169+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Rachel",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 9,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 2,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: "Rach",
    sex: "female",
    source_node_ids: ["2"],
  },
  {
    children_ids: null,
    created_at: "2024-08-05T23:05:26.466483+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "2ndChild",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 21,
    last_name: "Aarons2nd",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["2", "20"],
  },
  {
    children_ids: ["10", "21"],
    created_at: "2024-07-20T14:08:06.754277+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Aaron",
    gift_ideas: ["Baby thing1", "Babything2", "Workout app"],
    group_id: 2,
    group_name: "Best Friends",
    id: 2,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 9,
    partner_type: "spouse",
    phonetic_name: "Ah run",
    preferred_name: "Amac",
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: ["21"],
    created_at: "2024-08-05T23:03:37.796964+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Gina",
    gift_ideas: null,
    group_id: 3,
    group_name: null,
    id: 20,
    last_name: "AaronEx",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["2"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:26:48.225131+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Mackenzie",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 13,
    last_name: "Something",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["11", "12"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:07:07.332245+00:00",
    date_of_birth: "2000-10-01",
    date_of_death: null,
    first_name: "Shawn",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 1,
    last_name: "Ballay",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "sh AW n",
    preferred_name: null,
    sex: "male",
    source_node_ids: null,
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:16:38.501838+00:00",
    date_of_birth: "1992-02-15",
    date_of_death: "2024-07-01",
    first_name: "Bob",
    gift_ideas: null,
    group_id: 1,
    group_name: "Friends",
    id: 6,
    last_name: "Johnson",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "b ah b",
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:13:40.640285+00:00",
    date_of_birth: "1987-06-01",
    date_of_death: "2022-01-01",
    first_name: "Nolast",
    gift_ideas: null,
    group_id: 1,
    group_name: "Friends",
    id: 5,
    last_name: null,
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T19:35:40.425788+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Cody",
    gift_ideas: null,
    group_id: 2,
    group_name: "Best Friends",
    id: 19,
    last_name: "Zwier",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: "Code",
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:12:10.751453+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Donnie",
    gift_ideas: null,
    group_id: 2,
    group_name: "Best Friends",
    id: 3,
    last_name: "Irons",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "dah nee",
    preferred_name: "Don",
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:13:11.728096+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Steve",
    gift_ideas: ["Bachstuff1", "Bachstuff2"],
    group_id: 2,
    group_name: "Best Friends",
    id: 4,
    last_name: "Smith",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "st EE v",
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: ["13"],
    created_at: "2024-07-20T14:25:46.090227+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Lauren",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 11,
    last_name: "Something",
    maiden_name: "Mackenzie",
    partner_id: 12,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["2", "11"],
  },
  {
    children_ids: ["13"],
    created_at: "2024-07-20T14:26:16.95771+00:00",
    date_of_birth: "1986-11-01",
    date_of_death: null,
    first_name: "Eric",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 12,
    last_name: "Something",
    maiden_name: null,
    partner_id: 11,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["11"],
  },
  {
    children_ids: ["11", "2"],
    created_at: "2024-07-20T14:34:08.695662+00:00",
    date_of_birth: "1995-12-01",
    date_of_death: null,
    first_name: "Joe",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 14,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: 15,
    partner_type: "spouse",
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["2", "11"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T19:14:07.652311+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Jeff",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    id: 18,
    last_name: "Cranfield",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T19:13:48.184445+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Ashley",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    id: 17,
    last_name: "Cranfield",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "female",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T19:13:06.095934+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "John",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    id: 16,
    last_name: "Cheramie",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:18:29.73753+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Michelle",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    id: 8,
    last_name: null,
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "m ih - sh EH l",
    preferred_name: null,
    sex: "female",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:17:51.921577+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Drake",
    gift_ideas: null,
    group_id: 3,
    group_name: "Coworkers",
    id: 7,
    last_name: "Davis",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: "dr AI k",
    preferred_name: null,
    sex: "male",
    source_node_ids: ["1"],
  },
  {
    children_ids: null,
    created_at: "2024-07-20T14:25:12.091096+00:00",
    date_of_birth: null,
    date_of_death: null,
    first_name: "Levi",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 10,
    last_name: "Mackenzie",
    maiden_name: null,
    partner_id: null,
    partner_type: null,
    phonetic_name: null,
    preferred_name: null,
    sex: "male",
    source_node_ids: ["2", "9"],
  },
];
