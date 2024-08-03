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
  shownConnections: Tables<"connections">[];
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

  console.log("SHOWN_IDS:", combinedShownConnectionIds);

  return { shownNodes, shownConnections };
}

// !TODO: incorporate "depth" in the function
// !TODO: Need to only show friends if it's the rootNode
