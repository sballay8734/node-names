import { RawGroup, RawLink, RawNode } from "../types/graph";

export const nodes: RawNode[] = [
  { id: 1, depth: 1, name: "Root", group_id: null },
  { id: 2, depth: 2, name: "Aaron", group_id: 1 },
  { id: 3, depth: 2, name: "Beth", group_id: 2 },
  { id: 4, depth: 3, name: "Carol", group_id: 3 },
  { id: 5, depth: 3, name: "Diana", group_id: 4 },
  { id: 6, depth: 3, name: "Ethan", group_id: 5 },
];

export const links: RawLink[] = [
  { id: 1, source_id: 1, target_id: 2, relation_type: "friend" },
  { id: 2, source_id: 1, target_id: 3, relation_type: "colleague" },
  { id: 3, source_id: 1, target_id: 4, relation_type: "child_parent" },
  { id: 4, source_id: 1, target_id: 5, relation_type: "classmate" },
  { id: 5, source_id: 1, target_id: 6, relation_type: "virtual" },
];

export const groups: RawGroup[] = [
  { id: 1, source_id: 1, group_name: "friends" },
  { id: 2, source_id: 1, group_name: "work" },
  { id: 3, source_id: 1, group_name: "family" },
  { id: 4, source_id: 1, group_name: "school" },
  { id: 5, source_id: 1, group_name: "online" },
];
