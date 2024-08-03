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
  // gets partner DIRECT connections where EITHER partner is a target of the root (DOES NOT GET CHILDREN)
  const shownPartnerConnections = allConnections.filter(
    (c) =>
      (c.relationship_type === "spouse" ||
        c.relationship_type === "romantic_partner") &&
      (directTargetIds.includes(c.source_node_id) ||
        directTargetIds.includes(c.target_node_id)),
  );
  const shownPartnerConnectionIds = shownPartnerConnections.map((c) => c.id);
  const partnerIds = shownPartnerConnections.flatMap((c) => [
    c.target_node_id,
    c.source_node_id,
  ]);
  const partnerNodes = peopleCopy.filter((p) => partnerIds.includes(p.id));

  return {
    shownPartnerConnections,
    partnerIds,
    partnerNodes,
    shownPartnerConnectionIds,
  };
}

// CHILDREN ********************************************************************
export function getChildrenConAndIds(
  partnerNodes: EnhancedPerson[],
  allConnections: Tables<"connections">[],
) {
  const childrenIds = Array.from(
    new Set(partnerNodes.flatMap((p) => p.children_ids)),
  ).map((id) => Number(id));

  const shownChildrenConnections = allConnections.filter((c) => {
    if (c.relationship_details) {
      return childrenIds.includes(c.relationship_details.child);
    }
    return false;
  });
  const shownChildrenConnectionIds = shownChildrenConnections.map((c) => c.id);

  return { childrenIds, shownChildrenConnections, shownChildrenConnectionIds };
}

const hiddenConnections = [
  {
    created_at: "2024-07-20T14:31:59.74432+00:00",
    id: 11,
    relationship_details: null,
    relationship_type: "sibling",
    source_node_id: 2,
    target_node_id: 11,
  },
  {
    created_at: "2024-07-20T14:32:56.744166+00:00",
    id: 12,
    relationship_details: null,
    relationship_type: "spouse",
    source_node_id: 11,
    target_node_id: 12,
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
    created_at: "2024-07-20T14:38:57.003102+00:00",
    id: 21,
    relationship_details: null,
    relationship_type: "parent_child_in_law",
    source_node_id: 14,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:39:06.626076+00:00",
    id: 22,
    relationship_details: null,
    relationship_type: "parent_child_in_law",
    source_node_id: 15,
    target_node_id: 9,
  },
  {
    created_at: "2024-07-20T14:39:20.171124+00:00",
    id: 23,
    relationship_details: null,
    relationship_type: "parent_child_in_law",
    source_node_id: 14,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:39:29.646034+00:00",
    id: 24,
    relationship_details: null,
    relationship_type: "parent_child_in_law",
    source_node_id: 15,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:39:52.841548+00:00",
    id: 25,
    relationship_details: null,
    relationship_type: "sibling_in_law",
    source_node_id: 2,
    target_node_id: 12,
  },
  {
    created_at: "2024-07-20T14:40:44.864689+00:00",
    id: 26,
    relationship_details: null,
    relationship_type: "grandparent_grandchild",
    source_node_id: 14,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:40:54.2034+00:00",
    id: 27,
    relationship_details: null,
    relationship_type: "grandparent_grandchild",
    source_node_id: 15,
    target_node_id: 10,
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
    created_at: "2024-07-20T14:43:41.221945+00:00",
    id: 30,
    relationship_details: null,
    relationship_type: "niece_nephew_by_blood",
    source_node_id: 11,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-20T14:43:52.452217+00:00",
    id: 31,
    relationship_details: null,
    relationship_type: "niece_nephew_by_marriage",
    source_node_id: 12,
    target_node_id: 10,
  },
  {
    created_at: "2024-07-24T22:14:14.394002+00:00",
    id: 36,
    relationship_details: null,
    relationship_type: "spouse",
    source_node_id: 15,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:33:21.969605+00:00",
    id: 13,
    relationship_details: { child: 13, parent: 11 },
    relationship_type: "parent_child_biological",
    source_node_id: 11,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:33:35.881146+00:00",
    id: 14,
    relationship_details: { child: 13, parent: 12 },
    relationship_type: "parent_child_biological",
    source_node_id: 12,
    target_node_id: 13,
  },
  {
    created_at: "2024-07-20T14:35:17.465332+00:00",
    id: 15,
    relationship_details: { child: 2, parent: 14 },
    relationship_type: "parent_child_biological",
    source_node_id: 2,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:35:29.28415+00:00",
    id: 16,
    relationship_details: { child: 2, parent: 15 },
    relationship_type: "parent_child_biological",
    source_node_id: 2,
    target_node_id: 15,
  },
  {
    created_at: "2024-07-20T14:35:41.714255+00:00",
    id: 17,
    relationship_details: { child: 11, parent: 14 },
    relationship_type: "parent_child_biological",
    source_node_id: 11,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:35:52.933909+00:00",
    id: 18,
    relationship_details: { child: 11, parent: 15 },
    relationship_type: "parent_child_biological",
    source_node_id: 11,
    target_node_id: 15,
  },
];
