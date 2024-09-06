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
  | "virtual";
export type NodeStatus = "active" | "parent_active" | "inactive";
export type LinkStatus = "active" | "inactive";
export type GroupStatus = "active" | "inactive";

// RawShape from the database **************************************************
export interface RawNode {
  id: number;
  depth: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  group_id: number | null;
}
export interface RawGroup {
  id: number;
  group_name: string;
}
export interface RawLink {
  id: number;
  source_id: number;
  target_id: number;
  relation_type: RelationType;
}

// Shape after postioning ******************************************************
export interface PositionedNode extends RawNode {
  x: number;
  y: number;
}
export interface PositionedGroup extends RawGroup {
  angle: number;
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
export interface UiGroup extends PositionedGroup {
  group_status: GroupStatus;
  isShown: boolean;
}
export interface UiLink extends PositionedLink {
  node_1_status: NodeStatus;
  node_2_status: NodeStatus;
  link_status: LinkStatus;
}

export interface PosNodeMap {
  [id: number]: UiNode;
}
export interface PosLinkMap {
  [id: number]: UiLink;
}
export interface PosGroupMap {
  [id: number]: UiGroup;
}
