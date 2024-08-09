import { Tables } from "@/types/dbTypes";

const acceptedTypes = [
  "spouse",
  "parent_child_biological",
  "parent_child_non_biological",
  "romantic_partner",
];

export function getSourceValidConns(
  nodeId: number,
  connections: Tables<"connections">[],
  currentRootNodeId: number,
): Tables<"connections">[] {
  const nodeIsSource = connections.filter(
    (c) => c.source_node_id === currentRootNodeId,
  );
  const nodeIsTarget = connections.filter(
    (c) =>
      c.target_node_id === currentRootNodeId &&
      acceptedTypes.includes(c.relationship_type),
  );

  return [...nodeIsSource, ...nodeIsTarget];
}

export function getValidConns(
  nodeId: number,
  connections: Tables<"connections">[],
  isRoot: boolean,
): Tables<"connections">[] {
  const nodeIsSource = connections.filter((c) => c.source_node_id === nodeId);
  const nodeIsTarget = connections.filter(
    (c) =>
      c.target_node_id === nodeId &&
      acceptedTypes.includes(c.relationship_type),
  );

  return [...nodeIsSource, ...nodeIsTarget];
}

const NEW_CONNS = [
  {
    created_at: "2024-07-24T22:14:14.394002+00:00",
    id: 36,
    relationship_details: null,
    relationship_type: "spouse",
    source_node_id: 15,
    target_node_id: 14,
  },
  {
    created_at: "2024-07-20T14:29:26.66729+00:00",
    id: 10,
    relationship_details: { child: 10, parent: 9 },
    relationship_type: "parent_child_biological",
    source_node_id: 9,
    target_node_id: 10,
  },
  {
    created_at: "2024-08-05T23:08:51.597329+00:00",
    id: 38,
    relationship_details: { child: 21, parent: 20 },
    relationship_type: "parent_child_biological",
    source_node_id: 20,
    target_node_id: 21,
  },
  {
    created_at: "2024-07-20T14:35:41.714255+00:00",
    id: 17,
    relationship_details: { child: 11, parent: 14 },
    relationship_type: "parent_child_biological",
    source_node_id: 14,
    target_node_id: 11,
  },
  {
    created_at: "2024-07-20T14:35:52.933909+00:00",
    id: 18,
    relationship_details: { child: 11, parent: 15 },
    relationship_type: "parent_child_biological",
    source_node_id: 15,
    target_node_id: 11,
  },
];

const DERIVED = [
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 870634.7930699055,
    relationship_details: { child: 1, parent: 23 },
    relationship_type: "parent_child_biological",
    source_node_id: 23,
    target_node_id: 1,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 3183448.491810983,
    relationship_details: { child: 25, parent: 23 },
    relationship_type: "parent_child_biological",
    source_node_id: 23,
    target_node_id: 25,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 8729997.07392604,
    relationship_details: { child: 26, parent: 23 },
    relationship_type: "parent_child_biological",
    source_node_id: 23,
    target_node_id: 26,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 3934972.58654118,
    relationship_details: { child: 2, parent: 15 },
    relationship_type: "parent_child_biological",
    source_node_id: 15,
    target_node_id: 2,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 7539802.224972853,
    relationship_details: { child: 11, parent: 15 },
    relationship_type: "parent_child_biological",
    source_node_id: 15,
    target_node_id: 11,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 8398634.99843963,
    relationship_details: { child: 2, parent: 14 },
    relationship_type: "parent_child_biological",
    source_node_id: 14,
    target_node_id: 2,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 6116189.038444177,
    relationship_details: { child: 11, parent: 14 },
    relationship_type: "parent_child_biological",
    source_node_id: 14,
    target_node_id: 11,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 8348264.681990575,
    relationship_details: { child: 10, parent: 9 },
    relationship_type: "parent_child_biological",
    source_node_id: 9,
    target_node_id: 10,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 610090.3939507589,
    relationship_details: { child: 10, parent: 2 },
    relationship_type: "parent_child_biological",
    source_node_id: 2,
    target_node_id: 10,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 9522587.428473353,
    relationship_details: { child: 21, parent: 2 },
    relationship_type: "parent_child_biological",
    source_node_id: 2,
    target_node_id: 21,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 3419061.917630134,
    relationship_details: { child: 13, parent: 12 },
    relationship_type: "parent_child_biological",
    source_node_id: 12,
    target_node_id: 13,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 1368324.8988210151,
    relationship_details: { child: 13, parent: 11 },
    relationship_type: "parent_child_biological",
    source_node_id: 11,
    target_node_id: 13,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 4937776.980222493,
    relationship_details: { child: 1, parent: 24 },
    relationship_type: "parent_child_biological",
    source_node_id: 24,
    target_node_id: 1,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 1232268.8049399029,
    relationship_details: { child: 25, parent: 24 },
    relationship_type: "parent_child_biological",
    source_node_id: 24,
    target_node_id: 25,
  },
  {
    created_at: "2024-08-09T01:05:20.940Z",
    id: 9454435.30455243,
    relationship_details: { child: 26, parent: 24 },
    relationship_type: "parent_child_biological",
    source_node_id: 24,
    target_node_id: 26,
  },
];
