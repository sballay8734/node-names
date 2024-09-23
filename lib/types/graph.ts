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
export type NodeStatus = boolean;
export type LinkStatus = boolean;
export type GroupStatus = boolean;
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
  link_status: LinkStatus;
}

export interface PosNodeMap {
  [id: number]: UiNode;
}
export interface PosLinkMap {
  [id: number]: UiLink;
}

const nodesById = {
  "1": {
    depth: 1,
    endAngle: 0,
    group_id: null,
    group_name: "Root",
    id: 1,
    isRoot: true,
    isShown: true,
    name: "Root",
    node_status: "active",
    source_id: null,
    source_type: null,
    startAngle: 0,
    type: "root",
    x: 196.5,
    y: 386.5,
  },
  "10": {
    depth: 2,
    endAngle: 3.4557519189487724,
    group_id: null,
    group_name: "School",
    id: 10,
    isRoot: false,
    isShown: true,
    name: "School",
    node_status: "parent_active",
    source_id: 1,
    source_type: "root",
    startAngle: 2.199114857512855,
    type: "root_group",
    x: 127.20011875471744,
    y: 481.8831036368063,
  },
  "11": {
    depth: 2,
    endAngle: 4.71238898038469,
    group_id: null,
    group_name: "Online",
    id: 11,
    isRoot: false,
    isShown: true,
    name: "Online",
    node_status: "parent_active",
    source_id: 1,
    source_type: "root",
    startAngle: 3.4557519189487724,
    type: "root_group",
    x: 84.3704367288014,
    y: 350.06689636319373,
  },
  "12": {
    depth: 3,
    endAngle: -0.3141592653589793,
    group_id: 7,
    group_name: "Friends",
    id: 12,
    isRoot: false,
    isShown: true,
    name: "Donnie",
    node_status: "inactive",
    source_id: null,
    source_type: "group",
    startAngle: -1.5707963267948966,
    type: "node",
    x: 275.4699959192102,
    y: 298.9548702410013,
  },
  "2": {
    depth: 3,
    endAngle: -0.3141592653589793,
    group_id: 7,
    group_name: "Friends",
    id: 2,
    isRoot: false,
    isShown: true,
    name: "Aaron",
    node_status: "inactive",
    source_id: null,
    source_type: "group",
    startAngle: -1.5707963267948966,
    type: "node",
    x: 255.3572953424443,
    y: 284.3421379189429,
  },
  "3": {
    depth: 3,
    endAngle: 0.9424777960769379,
    group_id: 8,
    group_name: "Work",
    id: 3,
    isRoot: false,
    isShown: true,
    name: "Beth",
    node_status: "inactive",
    source_id: null,
    source_type: "group",
    startAngle: -0.3141592653589793,
    type: "node",
    x: 308.6295632711986,
    y: 422.9331036368063,
  },
  "4": {
    depth: 3,
    endAngle: 2.199114857512855,
    group_id: 9,
    group_name: "Family",
    id: 4,
    isRoot: false,
    isShown: true,
    name: "Carol",
    node_status: "inactive",
    source_id: null,
    source_type: "group",
    startAngle: 0.9424777960769379,
    type: "node",
    x: 196.5,
    y: 504.4,
  },
  "5": {
    depth: 3,
    endAngle: 3.4557519189487724,
    group_id: 10,
    group_name: "School",
    id: 5,
    isRoot: false,
    isShown: true,
    name: "Diana",
    node_status: "inactive",
    source_id: null,
    source_type: "group",
    startAngle: 2.199114857512855,
    type: "node",
    x: 84.37043672880141,
    y: 422.9331036368063,
  },
  "6": {
    depth: 3,
    endAngle: 4.71238898038469,
    group_id: 11,
    group_name: "Online",
    id: 6,
    isRoot: false,
    isShown: true,
    name: "Ethan",
    node_status: "inactive",
    source_id: null,
    source_type: "group",
    startAngle: 3.4557519189487724,
    type: "node",
    x: 127.20011875471741,
    y: 291.11689636319375,
  },
  "7": {
    depth: 2,
    endAngle: -0.3141592653589793,
    group_id: null,
    group_name: "Friends",
    id: 7,
    isRoot: false,
    isShown: true,
    name: "Friends",
    node_status: "parent_active",
    source_id: 1,
    source_type: "root",
    startAngle: -1.5707963267948966,
    type: "root_group",
    x: 196.5,
    y: 268.6,
  },
  "8": {
    depth: 2,
    endAngle: 0.9424777960769379,
    group_id: null,
    group_name: "Work",
    id: 8,
    isRoot: false,
    isShown: true,
    name: "Work",
    node_status: "parent_active",
    source_id: 1,
    source_type: "root",
    startAngle: -0.3141592653589793,
    type: "root_group",
    x: 308.6295632711986,
    y: 350.0668963631937,
  },
  "9": {
    depth: 2,
    endAngle: 2.199114857512855,
    group_id: null,
    group_name: "Family",
    id: 9,
    isRoot: false,
    isShown: true,
    name: "Family",
    node_status: "parent_active",
    source_id: 1,
    source_type: "root",
    startAngle: 0.9424777960769379,
    type: "root_group",
    x: 265.79988124528256,
    y: 481.8831036368063,
  },
};
const linksById = {
  "1": {
    id: 1,
    link_status: "parent_active",
    relation_type: null,
    source_id: 1,
    source_status: "active",
    source_type: "root",
    target_id: 7,
    target_status: "parent_active",
    target_type: "group",
    x1: 196.5,
    x2: 196.5,
    y1: 386.5,
    y2: 268.6,
  },
  "10": {
    id: 10,
    link_status: "inactive",
    relation_type: "virtual",
    source_id: 11,
    source_status: "parent_active",
    source_type: "root_group",
    target_id: 6,
    target_status: "inactive",
    target_type: "node",
    x1: 84.3704367288014,
    x2: 127.20011875471741,
    y1: 350.06689636319373,
    y2: 291.11689636319375,
  },
  "11": {
    id: 11,
    link_status: "inactive",
    relation_type: "friend",
    source_id: 7,
    source_status: "parent_active",
    source_type: "root_group",
    target_id: 12,
    target_status: "inactive",
    target_type: "node",
    x1: 196.5,
    x2: 275.4699959192102,
    y1: 268.6,
    y2: 298.9548702410013,
  },
  "2": {
    id: 2,
    link_status: "parent_active",
    relation_type: null,
    source_id: 1,
    source_status: "active",
    source_type: "root",
    target_id: 8,
    target_status: "parent_active",
    target_type: "group",
    x1: 196.5,
    x2: 308.6295632711986,
    y1: 386.5,
    y2: 350.0668963631937,
  },
  "3": {
    id: 3,
    link_status: "parent_active",
    relation_type: null,
    source_id: 1,
    source_status: "active",
    source_type: "root",
    target_id: 9,
    target_status: "parent_active",
    target_type: "group",
    x1: 196.5,
    x2: 265.79988124528256,
    y1: 386.5,
    y2: 481.8831036368063,
  },
  "4": {
    id: 4,
    link_status: "parent_active",
    relation_type: null,
    source_id: 1,
    source_status: "active",
    source_type: "root",
    target_id: 10,
    target_status: "parent_active",
    target_type: "group",
    x1: 196.5,
    x2: 127.20011875471744,
    y1: 386.5,
    y2: 481.8831036368063,
  },
  "5": {
    id: 5,
    link_status: "parent_active",
    relation_type: null,
    source_id: 1,
    source_status: "active",
    source_type: "root",
    target_id: 11,
    target_status: "parent_active",
    target_type: "group",
    x1: 196.5,
    x2: 84.3704367288014,
    y1: 386.5,
    y2: 350.06689636319373,
  },
  "6": {
    id: 6,
    link_status: "inactive",
    relation_type: "friend",
    source_id: 7,
    source_status: "parent_active",
    source_type: "root_group",
    target_id: 2,
    target_status: "inactive",
    target_type: "node",
    x1: 196.5,
    x2: 255.3572953424443,
    y1: 268.6,
    y2: 284.3421379189429,
  },
  "7": {
    id: 7,
    link_status: "inactive",
    relation_type: "colleague",
    source_id: 8,
    source_status: "parent_active",
    source_type: "root_group",
    target_id: 3,
    target_status: "inactive",
    target_type: "node",
    x1: 308.6295632711986,
    x2: 308.6295632711986,
    y1: 350.0668963631937,
    y2: 422.9331036368063,
  },
  "8": {
    id: 8,
    link_status: "inactive",
    relation_type: "child_parent",
    source_id: 9,
    source_status: "parent_active",
    source_type: "root_group",
    target_id: 4,
    target_status: "inactive",
    target_type: "node",
    x1: 265.79988124528256,
    x2: 196.5,
    y1: 481.8831036368063,
    y2: 504.4,
  },
  "9": {
    id: 9,
    link_status: "inactive",
    relation_type: "classmate",
    source_id: 10,
    source_status: "parent_active",
    source_type: "root_group",
    target_id: 5,
    target_status: "inactive",
    target_type: "node",
    x1: 127.20011875471744,
    x2: 84.37043672880141,
    y1: 481.8831036368063,
    y2: 422.9331036368063,
  },
};
const sourceById = {
  "1": [7, 8, 9, 10, 11],
  "10": [5],
  "11": [6],
  "7": [2, 12],
  "8": [3],
  "9": [4],
};
const nodeIds = [1, 2, 3, 4, 5, 6, 12, 7, 8, 9, 10, 11];
