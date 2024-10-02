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
