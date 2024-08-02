import { EnhancedPerson } from "@/features/D3/utils/getNodePositions";
import {
  DirectConnectionType,
  RelationshipType,
  Tables,
} from "@/types/dbTypes";

import { INode2 } from "../redux/graphManagement";

interface PersonMap {
  [id: string]: {
    shownConnections: number;
    hiddenConnections: number;
  };
}

interface TestPersonMap {
  [id: string]: {
    name: string;
    shownConnections: Tables<"connections">[];
    hiddenConnections: Tables<"connections">[];
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
    shownConnections: 0,
    hiddenConnections: 0,
  }));

  const personObject: PersonMap = {};

  // REMOVE: AND ALL REFERENCES vvvv
  const testPersonObject: TestPersonMap = {};
  // REMOVE: ^^^^

  allConnections.forEach((c) => {
    // REMOVE: vvvv
    const sourceNode = peopleCopy.find((p) => p.id === c.source_node_id);
    const targetNode = peopleCopy.find((p) => p.id === c.target_node_id);
    // REMOVE: ^^^^

    if (!sourceNode || !targetNode) return;

    if (!personObject[c.source_node_id]) {
      personObject[c.source_node_id] = {
        shownConnections: 0,
        hiddenConnections: 0,
      };
      testPersonObject[c.source_node_id] = {
        name: sourceNode.first_name,
        shownConnections: [],
        hiddenConnections: [],
      };
    }
    if (!personObject[c.target_node_id]) {
      personObject[c.target_node_id] = {
        shownConnections: 0,
        hiddenConnections: 0,
      };
      testPersonObject[c.target_node_id] = {
        name: targetNode.first_name,
        shownConnections: [],
        hiddenConnections: [],
      };
    }

    if (node.id === 1 && c.source_node_id === 1) {
      personObject[c.source_node_id].shownConnections += 1;
      testPersonObject[c.source_node_id].shownConnections.push(c);
    } else if (isDirectConnectionType(c.relationship_type)) {
      if (c.relationship_type === "spouse") {
        personObject[c.source_node_id].shownConnections += 1;
        testPersonObject[c.source_node_id].shownConnections.push(c);
      } else if (
        c.relationship_type === "parent_child_biological" &&
        c.source_node_id === c.relationship_details.parent
      ) {
        personObject[c.source_node_id].shownConnections += 1;
        testPersonObject[c.source_node_id].shownConnections.push(c);
      } else {
        personObject[c.source_node_id].hiddenConnections += 1;
        testPersonObject[c.source_node_id].hiddenConnections.push(c);
      }
    } else {
      personObject[c.source_node_id].hiddenConnections += 1;
      testPersonObject[c.source_node_id].hiddenConnections.push(c);
    }
  });

  const finalPeople: EnhancedPerson[] = peopleCopy.map((p) => {
    if (personObject[p.id]) {
      return {
        ...p,
        shownConnections: personObject[p.id].shownConnections,
        hiddenConnections: personObject[p.id].hiddenConnections,
      };
    } else {
      return p;
    }
  });

  // console.log("TEST:", JSON.stringify(testPersonObject));

  return finalPeople;
}

// !TODO: incorporate "depth" in the function
// !TODO: Need to only show friends if it's the rootNode
