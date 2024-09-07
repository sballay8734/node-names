import { RawGroup, RawLink, RawNode } from "../types/graph";

export const nodes: RawNode[] = [
  // Nodes ********************************************************************
  {
    id: 1,
    depth: 1,
    name: "Root",
    group_id: null,
    type: "node",
    group_name: "Root",
    source_type: null,
  },
  {
    id: 2,
    depth: 3,
    name: "Aaron",
    group_id: 7,
    type: "node",
    group_name: "Friends",
    source_type: "group",
  },
  {
    id: 3,
    depth: 3,
    name: "Beth",
    group_id: 8,
    type: "node",
    group_name: "Work",
    source_type: "group",
  },
  {
    id: 4,
    depth: 3,
    name: "Carol",
    group_id: 9,
    type: "node",
    group_name: "Family",
    source_type: "group",
  },
  {
    id: 5,
    depth: 3,
    name: "Diana",
    group_id: 10,
    type: "node",
    group_name: "School",
    source_type: "group",
  },
  {
    id: 6,
    depth: 3,
    name: "Ethan",
    group_id: 11,
    type: "node",
    group_name: "Online",
    source_type: "group",
  },
  {
    id: 12,
    depth: 3,
    name: "Donnie",
    group_id: 7,
    type: "node",
    group_name: "Friends",
    source_type: "group",
  },

  // Root Groups ***************************************************************
  {
    id: 7,
    depth: 2,
    name: "Friends",
    group_id: null,
    type: "group",
    group_name: "Friends",
    source_type: "root",
  },
  {
    id: 8,
    depth: 2,
    name: "Work",
    group_id: null,
    type: "group",
    group_name: "Work",
    source_type: "root",
  },
  {
    id: 9,
    depth: 2,
    name: "Family",
    group_id: null,
    type: "group",
    group_name: "Family",
    source_type: "root",
  },
  {
    id: 10,
    depth: 2,
    name: "School",
    group_id: null,
    type: "group",
    group_name: "School",
    source_type: "root",
  },
  {
    id: 11,
    depth: 2,
    name: "Online",
    group_id: null,
    type: "group",
    group_name: "Online",
    source_type: "root",
  },
];

export const links: RawLink[] = [
  // Links FROM node TO GROUP
  { id: 1, source_id: 1, target_id: 7, relation_type: null },
  { id: 2, source_id: 1, target_id: 8, relation_type: null },
  { id: 3, source_id: 1, target_id: 9, relation_type: null },
  { id: 4, source_id: 1, target_id: 10, relation_type: null },
  { id: 5, source_id: 1, target_id: 11, relation_type: null },

  // Links FROM group TO NODE
  { id: 6, source_id: 7, target_id: 2, relation_type: "friend" },
  { id: 11, source_id: 7, target_id: 12, relation_type: "friend" },
  { id: 7, source_id: 8, target_id: 3, relation_type: "colleague" },
  { id: 8, source_id: 9, target_id: 4, relation_type: "child_parent" },
  { id: 9, source_id: 10, target_id: 5, relation_type: "classmate" },
  { id: 10, source_id: 11, target_id: 6, relation_type: "virtual" },
];

// export const groups: RawGroup[] = [
//   { id: 1, source_id: 1, group_name: "friends" },
//   { id: 2, source_id: 1, group_name: "work" },
//   { id: 3, source_id: 1, group_name: "family" },
//   { id: 4, source_id: 1, group_name: "school" },
//   { id: 5, source_id: 1, group_name: "online" },
// ];
