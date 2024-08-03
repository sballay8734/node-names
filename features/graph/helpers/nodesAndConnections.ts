import { EnhancedPerson } from "@/features/D3/utils/getNodePositions";
import { Tables } from "@/types/dbTypes";

// ROOT ************************************************************************
export function getRootConAndIds(
  allConnections: Tables<"connections">[],
  rootId: number,
) {
  const rootDirectConnections = allConnections.filter(
    (c) => c.source_node_id === rootId,
  );
  const directTargetIds = rootDirectConnections.map((c) => c.target_node_id);

  return { rootDirectConnections, directTargetIds };
}

// PARTNERS ********************************************************************
export function getPartnerConIdsNodes(
  allConnections: Tables<"connections">[],
  directTargetIds: number[],
  peopleCopy: EnhancedPerson[],
) {
  // get partner connections where EITHER partner is a target of the root
  const partnerConnections = allConnections.filter(
    (c) =>
      (c.relationship_type === "spouse" ||
        c.relationship_type === "romantic_partner") &&
      (directTargetIds.includes(c.source_node_id) ||
        directTargetIds.includes(c.target_node_id)),
  );
  const partnerIds = partnerConnections.flatMap((c) => [
    c.target_node_id,
    c.source_node_id,
  ]);
  const partnerNodes = peopleCopy.filter((p) => partnerIds.includes(p.id));

  return { partnerConnections, partnerIds, partnerNodes };
}

// CHILDREN ********************************************************************
export function getChildrenConAndIds(
  partnerNodes: EnhancedPerson[],
  allConnections: Tables<"connections">[],
) {
  const childrenIds = Array.from(
    new Set(partnerNodes.flatMap((p) => p.children_ids)),
  ).map((id) => Number(id));

  const childrenConnections = allConnections.filter((c) => {
    if (c.relationship_details) {
      return childrenIds.includes(c.relationship_details.child);
    }
    return false;
  });

  return { childrenIds, childrenConnections };
}
