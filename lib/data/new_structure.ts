import { RawGroup, RawLink, RawNode } from "../types/graph";

export const nodes: RawNode[] = [
  // Nodes ********************************************************************
  {
    id: 1,
    depth: 1,
    name: "Root",
    group_id: null,
    type: "node",
    source_type: null,
  },
  {
    id: 2,
    depth: 2,
    name: "Aaron",
    group_id: 7,
    type: "node",
    source_type: "group",
  },
  {
    id: 3,
    depth: 2,
    name: "Beth",
    group_id: 8,
    type: "node",
    source_type: "group",
  },
  {
    id: 4,
    depth: 3,
    name: "Carol",
    group_id: 9,
    type: "node",
    source_type: "group",
  },
  {
    id: 5,
    depth: 3,
    name: "Diana",
    group_id: 10,
    type: "node",
    source_type: "group",
  },
  {
    id: 6,
    depth: 3,
    name: "Ethan",
    group_id: 11,
    type: "node",
    source_type: "group",
  },

  // Root Groups ***************************************************************
  {
    id: 7,
    depth: 2,
    name: "Friends",
    group_id: null,
    type: "group",
    source_type: "root",
  },
  {
    id: 8,
    depth: 2,
    name: "Work",
    group_id: null,
    type: "group",
    source_type: "root",
  },
  {
    id: 9,
    depth: 2,
    name: "Family",
    group_id: null,
    type: "group",
    source_type: "root",
  },
  {
    id: 10,
    depth: 2,
    name: "School",
    group_id: null,
    type: "group",
    source_type: "root",
  },
  {
    id: 11,
    depth: 2,
    name: "Online",
    group_id: null,
    type: "group",
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

const tNodes = {
  activeRootId: 1,
  allIds: [7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6],
  byId: {
    "1": {
      angle: 0,
      depth: 1,
      group_id: null,
      id: 1,
      isRoot: true,
      isShown: true,
      name: "Root",
      node_status: "active",
      source_type: null,
      type: "node",
      x: 196.5,
      y: 386.5,
    },
    "10": {
      angle: 2.199114857512855,
      depth: 2,
      group_id: null,
      id: 10,
      isRoot: false,
      isShown: true,
      name: "School",
      node_status: "inactive",
      source_type: "root",
      type: "group",
      x: 353.1122147477076,
      y: 513.6774715157418,
    },
    "11": {
      angle: 3.4557519189487724,
      depth: 2,
      group_id: null,
      id: 11,
      isRoot: false,
      isShown: true,
      name: "Online",
      node_status: "inactive",
      source_type: "root",
      type: "group",
      x: 352.7489434837049,
      y: 337.9225284842583,
    },
    "2": {
      angle: -1.5707963267948966,
      depth: 2,
      group_id: 7,
      id: 2,
      isRoot: false,
      isShown: true,
      name: "Aaron",
      node_status: "inactive",
      source_type: "group",
      type: "node",
      x: 353.70000000000005,
      y: 129.29999999999998,
    },
    "3": {
      angle: -0.3141592653589793,
      depth: 2,
      group_id: 8,
      id: 3,
      isRoot: false,
      isShown: true,
      name: "Beth",
      node_status: "inactive",
      source_type: "group",
      type: "node",
      x: 449.75670814581053,
      y: 307.0208290467635,
    },
    "4": {
      angle: 0.9424777960769379,
      depth: 3,
      group_id: 9,
      id: 4,
      isRoot: false,
      isShown: true,
      name: "Carol",
      node_status: "inactive",
      source_type: "group",
      type: "node",
      x: 413.06631048153986,
      y: 594.5791709532364,
    },
    "5": {
      angle: 2.199114857512855,
      depth: 3,
      group_id: 10,
      id: 5,
      isRoot: false,
      isShown: true,
      name: "Diana",
      node_status: "inactive",
      source_type: "group",
      type: "node",
      x: 294.3336895184603,
      y: 594.5791709532365,
    },
    "6": {
      angle: 3.4557519189487724,
      depth: 3,
      group_id: 11,
      id: 6,
      isRoot: false,
      isShown: true,
      name: "Ethan",
      node_status: "inactive",
      source_type: "group",
      type: "node",
      x: 257.64329185418956,
      y: 307.02082904676354,
    },
    "7": {
      angle: -1.5707963267948966,
      depth: 2,
      group_id: null,
      id: 7,
      isRoot: false,
      isShown: true,
      name: "Friends",
      node_status: "inactive",
      source_type: "root",
      type: "group",
      x: 353.70000000000005,
      y: 229.29999999999998,
    },
    "8": {
      angle: -0.3141592653589793,
      depth: 2,
      group_id: null,
      id: 8,
      isRoot: false,
      isShown: true,
      name: "Work",
      node_status: "inactive",
      source_type: "root",
      type: "group",
      x: 354.65105651629517,
      y: 337.92252848425824,
    },
    "9": {
      angle: 0.9424777960769379,
      depth: 2,
      group_id: null,
      id: 9,
      isRoot: false,
      isShown: true,
      name: "Family",
      node_status: "inactive",
      source_type: "root",
      type: "group",
      x: 354.2877852522925,
      y: 513.6774715157417,
    },
  },
};
