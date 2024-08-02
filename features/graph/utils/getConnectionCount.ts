import { EnhancedPerson } from "@/features/D3/utils/getNodePositions";
import {
  DirectConnectionType,
  RelationshipType,
  Tables,
} from "@/types/dbTypes";

import { INode2 } from "../redux/graphManagement";

interface PersonMap {
  [id: string]: {
    totalConnections: number;
    hiddenConnections: number;
  };
}

const directConnectionTypes: DirectConnectionType[] = [
  "spouse",
  "parent_child_biological",
  "parent_child_non_biological",
  "romantic_partner",
];

function isDirectConnectionType(relationshipType: RelationshipType): boolean {
  return directConnectionTypes.includes(
    relationshipType as DirectConnectionType,
  );
}

export function getConnectionCount(
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  depth: 0 | 1,
  node: INode2,
): EnhancedPerson[] {
  const peopleCopy: EnhancedPerson[] = allPeople.map((p) => ({
    ...p,
    totalConnections: 0,
    hiddenConnections: 0,
  }));

  const personObject: PersonMap = {};

  console.log(allConnections);

  allConnections.forEach((c) => {
    if (!personObject[c.source_node_id]) {
      personObject[c.source_node_id] = {
        totalConnections: 0,
        hiddenConnections: 0,
      };
    }
    if (
      c.relationship_type === "friend" &&
      node.id === 1 &&
      c.source_node_id === 1
    ) {
      personObject[c.source_node_id].totalConnections += 1;
    }

    if (isDirectConnectionType(c.relationship_type)) {
      personObject[c.source_node_id].hiddenConnections += 1;
    }

    personObject[c.source_node_id].totalConnections += 1;
  });

  const finalPeople: EnhancedPerson[] = peopleCopy.map((p) => {
    if (personObject[p.id]) {
      return {
        ...p,
        totalConnections: personObject[p.id].totalConnections,
        hiddenConnections: personObject[p.id].hiddenConnections,
      };
    } else {
      return p;
    }
  });

  return finalPeople;
}

// !TODO: incorporate "depth" in the function
// !TODO: Need to only show friends if it's the rootNode
