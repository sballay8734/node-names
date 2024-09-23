import { Database } from "./database";

// union types
export type RelationType =
  | "partner"
  | "friend"
  | "sibling"
  | "parent_child"
  | "child_parent"
  | "colleague"
  | "classmate"
  | "virtual"
  | "group";
export type NodeStatus = "active" | "parent_active" | "inactive";
export type LinkStatus = "active" | "parent_active" | "inactive";
export type GroupStatus = "active" | "parent_active" | "inactive";
export type NodeType = "node" | "group" | "root_group" | "root";

// RawShape from the database **************************************************
export interface RawNode {
  id: number;
  depth: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  group_id: number | null; // id of group the node is a part of
  type: "node" | "group" | "root_group" | "root";
  source_id: number | null; // ONLY groups will have a source_id
  group_name: string | null;
  source_type: "node" | "group" | "mixed" | "root" | null;
}

// export interface RawGroup {
//   id: number;
//   source_id: number;
//   group_name: string;
// }

export interface RawLink {
  id: number;
  source_id: number;
  target_id: number;
  source_type: "group" | "root" | "node" | "root_group";
  target_type: "group" | "root" | "node" | "root_group";
  relation_type: RelationType | null;
}

// !TODO: START and END angle should not be optional. UPDATE AFTER REFACTOR
// Shape after postioning ******************************************************
export interface PositionedNode extends RawNode {
  startAngle: number;
  endAngle: number;
  // angle: number;
  x: number;
  y: number;
}
// export interface PositionedGroup extends RawGroup {
//   startAngle?: number;
//   endAngle?: number;
//   // angle: number;
//   x: number;
//   y: number;
// }
export interface PositionedLink extends RawLink {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Shape after initial redux dispatch (Ui stuff added) *************************
export interface UiNode extends PositionedNode {
  isRoot: boolean;
  node_status: NodeStatus;
  isShown: boolean;
}
// export interface UiGroup extends PositionedGroup {
//   group_status: GroupStatus;
//   isShown: boolean;
// }
export interface UiLink extends PositionedLink {
  source_status: NodeStatus;
  target_status: NodeStatus;
  link_status: LinkStatus;
}

export interface PosNodeMap {
  [id: number]: UiNode;
}
export interface PosLinkMap {
  [id: number]: UiLink;
}
// export interface PosGroupMap {
//   [id: number]: UiGroup;
// }

const refSource = {
  "1": {
    "10": {
      depth: 2,
      endAngle: 0,
      group_id: null,
      group_name: "School",
      id: 10,
      name: "School",
      source_id: 1,
      source_type: "root",
      startAngle: 0,
      type: "root_group",
      x: 196.5,
      y: 386.5,
    },
    "11": {
      depth: 2,
      endAngle: 0,
      group_id: null,
      group_name: "Online",
      id: 11,
      name: "Online",
      source_id: 1,
      source_type: "root",
      startAngle: 0,
      type: "root_group",
      x: 196.5,
      y: 386.5,
    },
    "7": {
      depth: 2,
      endAngle: 0,
      group_id: null,
      group_name: "Friends",
      id: 7,
      name: "Friends",
      source_id: 1,
      source_type: "root",
      startAngle: 0,
      type: "root_group",
      x: 196.5,
      y: 386.5,
    },
    "8": {
      depth: 2,
      endAngle: 0,
      group_id: null,
      group_name: "Work",
      id: 8,
      name: "Work",
      source_id: 1,
      source_type: "root",
      startAngle: 0,
      type: "root_group",
      x: 196.5,
      y: 386.5,
    },
    "9": {
      depth: 2,
      endAngle: 0,
      group_id: null,
      group_name: "Family",
      id: 9,
      name: "Family",
      source_id: 1,
      source_type: "root",
      startAngle: 0,
      type: "root_group",
      x: 196.5,
      y: 386.5,
    },
    size: 5,
  },
  "10": {
    "5": {
      depth: 3,
      endAngle: 0,
      group_id: 10,
      group_name: "School",
      id: 5,
      name: "Diana",
      source_id: null,
      source_type: "group",
      startAngle: 0,
      type: "node",
      x: 196.5,
      y: 386.5,
    },
    size: 1,
  },
  "11": {
    "6": {
      depth: 3,
      endAngle: 0,
      group_id: 11,
      group_name: "Online",
      id: 6,
      name: "Ethan",
      source_id: null,
      source_type: "group",
      startAngle: 0,
      type: "node",
      x: 196.5,
      y: 386.5,
    },
    size: 1,
  },
  "7": {
    "12": {
      depth: 3,
      endAngle: 0,
      group_id: 7,
      group_name: "Friends",
      id: 12,
      name: "Donnie",
      source_id: null,
      source_type: "group",
      startAngle: 0,
      type: "node",
      x: 196.5,
      y: 386.5,
    },
    "2": {
      depth: 3,
      endAngle: 0,
      group_id: 7,
      group_name: "Friends",
      id: 2,
      name: "Aaron",
      source_id: null,
      source_type: "group",
      startAngle: 0,
      type: "node",
      x: 196.5,
      y: 386.5,
    },
    size: 2,
  },
  "8": {
    "3": {
      depth: 3,
      endAngle: 0,
      group_id: 8,
      group_name: "Work",
      id: 3,
      name: "Beth",
      source_id: null,
      source_type: "group",
      startAngle: 0,
      type: "node",
      x: 196.5,
      y: 386.5,
    },
    size: 1,
  },
  "9": {
    "4": {
      depth: 3,
      endAngle: 0,
      group_id: 9,
      group_name: "Family",
      id: 4,
      name: "Carol",
      source_id: null,
      source_type: "group",
      startAngle: 0,
      type: "node",
      x: 196.5,
      y: 386.5,
    },
    size: 1,
  },
};

const refNodes = {
  "1": {
    depth: 1,
    endAngle: 0,
    group_id: null,
    group_name: "Root",
    id: 1,
    name: "Root",
    source_id: null,
    source_type: null,
    startAngle: 0,
    type: "root",
    x: 196.5,
    y: 386.5,
  },
  "10": {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "School",
    id: 10,
    name: "School",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  "11": {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Online",
    id: 11,
    name: "Online",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  "12": {
    depth: 3,
    endAngle: 0,
    group_id: 7,
    group_name: "Friends",
    id: 12,
    name: "Donnie",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  "2": {
    depth: 3,
    endAngle: 0,
    group_id: 7,
    group_name: "Friends",
    id: 2,
    name: "Aaron",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  "3": {
    depth: 3,
    endAngle: 0,
    group_id: 8,
    group_name: "Work",
    id: 3,
    name: "Beth",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  "4": {
    depth: 3,
    endAngle: 0,
    group_id: 9,
    group_name: "Family",
    id: 4,
    name: "Carol",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  "5": {
    depth: 3,
    endAngle: 0,
    group_id: 10,
    group_name: "School",
    id: 5,
    name: "Diana",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  "6": {
    depth: 3,
    endAngle: 0,
    group_id: 11,
    group_name: "Online",
    id: 6,
    name: "Ethan",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  "7": {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Friends",
    id: 7,
    name: "Friends",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  "8": {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Work",
    id: 8,
    name: "Work",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  "9": {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Family",
    id: 9,
    name: "Family",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
};

const refHash = [
  {
    depth: 1,
    endAngle: 0,
    group_id: null,
    group_name: "Root",
    id: 1,
    name: "Root",
    source_id: null,
    source_type: null,
    startAngle: 0,
    type: "root",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 3,
    endAngle: 0,
    group_id: 7,
    group_name: "Friends",
    id: 2,
    name: "Aaron",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 3,
    endAngle: 0,
    group_id: 8,
    group_name: "Work",
    id: 3,
    name: "Beth",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 3,
    endAngle: 0,
    group_id: 9,
    group_name: "Family",
    id: 4,
    name: "Carol",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 3,
    endAngle: 0,
    group_id: 10,
    group_name: "School",
    id: 5,
    name: "Diana",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 3,
    endAngle: 0,
    group_id: 11,
    group_name: "Online",
    id: 6,
    name: "Ethan",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Friends",
    id: 7,
    name: "Friends",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Work",
    id: 8,
    name: "Work",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Family",
    id: 9,
    name: "Family",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "School",
    id: 10,
    name: "School",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 2,
    endAngle: 0,
    group_id: null,
    group_name: "Online",
    id: 11,
    name: "Online",
    source_id: 1,
    source_type: "root",
    startAngle: 0,
    type: "root_group",
    x: 196.5,
    y: 386.5,
  },
  {
    depth: 3,
    endAngle: 0,
    group_id: 7,
    group_name: "Friends",
    id: 12,
    name: "Donnie",
    source_id: null,
    source_type: "group",
    startAngle: 0,
    type: "node",
    x: 196.5,
    y: 386.5,
  },
];
