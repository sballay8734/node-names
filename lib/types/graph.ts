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

const refSource = {
  "1": {
    id: 1,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 7,
    target_type: "group",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "10": {
    id: 10,
    relation_type: "virtual",
    source_id: 11,
    source_type: "root_group",
    target_id: 6,
    target_type: "node",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "11": {
    id: 11,
    relation_type: "friend",
    source_id: 7,
    source_type: "root_group",
    target_id: 12,
    target_type: "node",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "2": {
    id: 2,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 8,
    target_type: "group",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "3": {
    id: 3,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 9,
    target_type: "group",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "4": {
    id: 4,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 10,
    target_type: "group",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "5": {
    id: 5,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 11,
    target_type: "group",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "6": {
    id: 6,
    relation_type: "friend",
    source_id: 7,
    source_type: "root_group",
    target_id: 2,
    target_type: "node",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "7": {
    id: 7,
    relation_type: "colleague",
    source_id: 8,
    source_type: "root_group",
    target_id: 3,
    target_type: "node",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "8": {
    id: 8,
    relation_type: "child_parent",
    source_id: 9,
    source_type: "root_group",
    target_id: 4,
    target_type: "node",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
  "9": {
    id: 9,
    relation_type: "classmate",
    source_id: 10,
    source_type: "root_group",
    target_id: 5,
    target_type: "node",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  },
};

const after = {
  "1": {
    id: 1,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 7,
    target_type: "group",
    x1: 196.5,
    x2: 196.5,
    y1: 386.5,
    y2: 268.6,
  },
  "10": {
    id: 10,
    relation_type: "virtual",
    source_id: 11,
    source_type: "root_group",
    target_id: 6,
    target_type: "node",
    x1: 84.3704367288014,
    x2: 127.20011875471741,
    y1: 350.06689636319373,
    y2: 291.11689636319375,
  },
  "11": {
    id: 11,
    relation_type: "friend",
    source_id: 7,
    source_type: "root_group",
    target_id: 12,
    target_type: "node",
    x1: 196.5,
    x2: 275.4699959192102,
    y1: 268.6,
    y2: 298.9548702410013,
  },
  "2": {
    id: 2,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 8,
    target_type: "group",
    x1: 196.5,
    x2: 308.6295632711986,
    y1: 386.5,
    y2: 350.0668963631937,
  },
  "3": {
    id: 3,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 9,
    target_type: "group",
    x1: 196.5,
    x2: 265.79988124528256,
    y1: 386.5,
    y2: 481.8831036368063,
  },
  "4": {
    id: 4,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 10,
    target_type: "group",
    x1: 196.5,
    x2: 127.20011875471744,
    y1: 386.5,
    y2: 481.8831036368063,
  },
  "5": {
    id: 5,
    relation_type: null,
    source_id: 1,
    source_type: "root",
    target_id: 11,
    target_type: "group",
    x1: 196.5,
    x2: 84.3704367288014,
    y1: 386.5,
    y2: 350.06689636319373,
  },
  "6": {
    id: 6,
    relation_type: "friend",
    source_id: 7,
    source_type: "root_group",
    target_id: 2,
    target_type: "node",
    x1: 196.5,
    x2: 255.3572953424443,
    y1: 268.6,
    y2: 284.3421379189429,
  },
  "7": {
    id: 7,
    relation_type: "colleague",
    source_id: 8,
    source_type: "root_group",
    target_id: 3,
    target_type: "node",
    x1: 308.6295632711986,
    x2: 308.6295632711986,
    y1: 350.0668963631937,
    y2: 422.9331036368063,
  },
  "8": {
    id: 8,
    relation_type: "child_parent",
    source_id: 9,
    source_type: "root_group",
    target_id: 4,
    target_type: "node",
    x1: 265.79988124528256,
    x2: 196.5,
    y1: 481.8831036368063,
    y2: 504.4,
  },
  "9": {
    id: 9,
    relation_type: "classmate",
    source_id: 10,
    source_type: "root_group",
    target_id: 5,
    target_type: "node",
    x1: 127.20011875471744,
    x2: 84.37043672880141,
    y1: 481.8831036368063,
    y2: 422.9331036368063,
  },
};
