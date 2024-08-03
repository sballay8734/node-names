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

  // ROOT CONNECTIONS & ROOT TARGETS IDS ***************************************
  const { rootDirectConnections, directTargetIds } = getRootConAndIds(
    allConnections,
    currentRootNode.id,
  );

  // PARTNER CONNECTIONS, IDS, & NODES *****************************************
  const { partnerConnections, partnerIds, partnerNodes } =
    getPartnerConIdsNodes(allConnections, directTargetIds, peopleCopy);

  // CHILDREN CONNECTIONS & IDS ************************************************
  const { childrenIds, childrenConnections } = getChildrenConAndIds(
    partnerNodes,
    allConnections,
  );

  // COMBINE ALL IDS
  const combinedIds = [
    ...directTargetIds,
    ...partnerIds,
    ...childrenIds,
    currentRootNode.id,
  ];

  // REMOVE DUPLICATE IDS
  const uniqueIdsToShow = Array.from(new Set(combinedIds));

  // GET NODES THAT NEED TO BE SHOWN BY USING IDS
  const shownNodes = peopleCopy.filter((p) => uniqueIdsToShow.includes(p.id));

  // COMBINE ALL CONNECTIONS
  shownConnections = [
    ...rootDirectConnections,
    ...partnerConnections,
    ...childrenConnections,
  ];

  return { shownNodes, shownConnections };
}

// !TODO: incorporate "depth" in the function
// !TODO: Need to only show friends if it's the rootNode
