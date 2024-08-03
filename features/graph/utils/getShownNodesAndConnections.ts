import { EnhancedPerson } from "@/features/D3/utils/getNodePositions";
import { Tables } from "@/types/dbTypes";

import {
  getChildrenConAndIds,
  getPartnerConIdsNodes,
  getRootConAndIds,
} from "../helpers/nodesAndConnections";
import { INode2 } from "../redux/graphManagement";

export function getShownNodesAndConnections(
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  depth: 0 | 1,
  currentRootNode: INode2,
): {
  shownNodes: EnhancedPerson[];
  finalConnections: Tables<"connections">[];
} {
  // initialze proper shape of nodes
  const peopleCopy: EnhancedPerson[] = allPeople.map((p) => ({
    ...p,
    shownConnections: 0,
    hiddenConnections: 0,
  }));

  let shownConnections: Tables<"connections">[] = [];
  let hiddenConnections: Tables<"connections">[] = [];

  // ROOT CONNECTIONS & ROOT TARGETS IDS ***************************************
  const { rootDirectConnections, directTargetIds } = getRootConAndIds(
    allConnections,
    currentRootNode.id,
  );

  // PARTNER CONNECTIONS, IDS, & NODES *****************************************
  const {
    shownPartnerConnections,
    partnerIds,
    partnerNodes,
    shownPartnerConnectionIds,
  } = getPartnerConIdsNodes(allConnections, directTargetIds, peopleCopy);

  // CHILDREN CONNECTIONS & IDS ************************************************
  const { childrenIds, shownChildrenConnections, shownChildrenConnectionIds } =
    getChildrenConAndIds(partnerNodes, allConnections);

  // COMBINE ALL IDS
  const combinedShownNodeIds = [
    ...directTargetIds,
    ...partnerIds,
    ...childrenIds,
    currentRootNode.id,
  ];

  // Combine the ids of all shown connections but NOT targets of rootNode
  const combinedShownConnectionIds = [
    ...shownPartnerConnectionIds,
    ...shownChildrenConnectionIds,
  ];

  // REMOVE DUPLICATE NODE IDS
  const uniqueIdsToShow = Array.from(new Set(combinedShownNodeIds));

  // GET NODES THAT NEED TO BE SHOWN BY USING IDS
  const shownNodes = peopleCopy.filter((p) => uniqueIdsToShow.includes(p.id));

  // COMBINE ALL CONNECTIONS
  shownConnections = [
    ...rootDirectConnections,
    ...shownPartnerConnections,
    ...shownChildrenConnections,
  ];

  // Filter out duplicate connections using a Set
  const seenIds = new Set<number>();
  const finalConnections = shownConnections.filter((c) => {
    if (!seenIds.has(c.id)) {
      seenIds.add(c.id);
      return true;
    }
    return false;
  });

  // identify hidden connections
  hiddenConnections = allConnections.filter(
    (c) =>
      !combinedShownConnectionIds.includes(c.id) &&
      c.source_node_id !== currentRootNode.id &&
      (!directTargetIds.includes(c.source_node_id) ||
        !directTargetIds.includes(c.target_node_id)),
  );

  // Update hiddenConnections count for each shown node
  shownNodes.forEach((node) => {
    const hiddenConCount = hiddenConnections.filter(
      (c) => c.source_node_id === node.id,
    ).length;
    node.hiddenConnections = hiddenConCount;
  });

  console.log(hiddenConnections);

  return { shownNodes, finalConnections };
}

// !TODO: incorporate "depth" in the function

const HIDDEN_CONNS = [
  {
    created_at: "2024-07-20T14:09:26.741696+00:00",
    id: 1,
    relationship_details: null,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 2,
  },
  {
    created_at: "2024-07-20T14:20:22.55563+00:00",
    id: 2,
    relationship_details: null,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 3,
  },
  {
    created_at: "2024-07-20T14:20:36.040121+00:00",
    id: 3,
    relationship_details: null,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 4,
  },
  {
    created_at: "2024-07-20T14:21:02.655177+00:00",
    id: 4,
    relationship_details: null,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 5,
  },
  {
    created_at: "2024-07-20T14:21:24.155532+00:00",
    id: 5,
    relationship_details: null,
    relationship_type: "sibling",
    source_node_id: 1,
    target_node_id: 6,
  },
  {
    created_at: "2024-07-20T14:21:53.545954+00:00",
    id: 6,
    relationship_details: null,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 7,
  },
  {
    created_at: "2024-07-20T14:22:12.272541+00:00",
    id: 7,
    relationship_details: null,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 8,
  },
  {
    created_at: "2024-07-20T14:36:41.567854+00:00",
    id: 19,
    relationship_details: null,
    relationship_type: "grandparent_grandchild",
    source_node_id: 14,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:36:53.281104+00:00",
    id: 20,
    relationship_details: null,
    relationship_type: "grandparent_grandchild",
    source_node_id: 15,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:41:35.533862+00:00",
    id: 28,
    relationship_details: null,
    relationship_type: "niece_nephew_by_blood",
    source_node_id: 13,
    target_node_id: 2,
  },
  {
    created_at: "2024-07-20T14:42:59.654936+00:00",
    id: 29,
    relationship_details: null,
    relationship_type: "niece_nephew_by_marriage",
    source_node_id: 13,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T19:15:06.726173+00:00",
    id: 32,
    relationship_details: null,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 17,
  },
  {
    created_at: "2024-07-20T19:15:50.777921+00:00",
    id: 34,
    relationship_details: null,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 18,
  },
  {
    created_at: "2024-07-20T19:36:25.528396+00:00",
    id: 35,
    relationship_details: null,
    relationship_type: "friend",
    source_node_id: 1,
    target_node_id: 19,
  },
  {
    created_at: "2024-07-20T19:15:29.675303+00:00",
    id: 33,
    relationship_details: null,
    relationship_type: "coworker",
    source_node_id: 1,
    target_node_id: 16,
  },
];
