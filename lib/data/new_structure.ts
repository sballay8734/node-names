type RelationType =
  | "partner"
  | "friend"
  | "sibling"
  | "parent_child"
  | "child_parent"
  | "colleague"
  | "classmate"
  | "virtual";

export interface NLink {
  id: number;
  source_id: number;
  target_id: number;
  relation_type: RelationType;
}

export interface NPerson {
  id: number;
  depth: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  group_id: number | null;
}

export interface NGroup {
  id: number;
  group_name: string;
}

export const people: NPerson[] = [
  { id: 1, depth: 1, name: "Root", group_id: null },
  { id: 2, depth: 2, name: "Aaron", group_id: 1 },
  { id: 3, depth: 2, name: "Beth", group_id: 2 },
  { id: 4, depth: 3, name: "Carol", group_id: 3 },
  { id: 5, depth: 3, name: "Diana", group_id: 4 },
  { id: 6, depth: 3, name: "Ethan", group_id: 5 },
];

export const links: NLink[] = [
  { id: 1, source_id: 1, target_id: 2, relation_type: "friend" },
  { id: 2, source_id: 1, target_id: 3, relation_type: "colleague" },
  { id: 3, source_id: 1, target_id: 4, relation_type: "child_parent" },
  { id: 4, source_id: 1, target_id: 5, relation_type: "classmate" },
  { id: 5, source_id: 1, target_id: 6, relation_type: "virtual" },
];

export const groups: NGroup[] = [
  { id: 1, group_name: "friends" },
  { id: 2, group_name: "work" },
  { id: 3, group_name: "family" },
  { id: 4, group_name: "school" },
  { id: 5, group_name: "online" },
];
