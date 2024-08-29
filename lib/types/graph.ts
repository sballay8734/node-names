import { Database } from "./database";

// status types
export type VertexStatus = "active" | "parent_active" | "inactive";
export type EdgeStatus = "active" | "inactive";
// VERTICES *******************************************************************
export interface RawVertex {
  id: number;
  user_id: string;
  created_at: string;
  is_user: boolean;
  first_name: string;
  last_name: string | null;
  sex: Database["public"]["Enums"]["sexes"];

  date_of_birth: string | null;
  date_of_death: string | null;
  gift_ideas: string[] | null;
  group_id: number | null;

  maiden_name: string | null;
  phonetic_name: string | null;
  preferred_name: string | null;
}
// What d3 adds to node (Just added here for better vis on UiVertex)
interface PropsFromD3 {
  index?: number | undefined;
  x?: number | undefined;
  y?: number | undefined;
  vx?: number | undefined;
  vy?: number | undefined;
  fx?: number | null | undefined;
  fy?: number | null | undefined;
}
// UI Extensions of Raw types WITH ui controlling properties
export interface UiVertex extends RawVertex, PropsFromD3 {
  isCurrentRoot: boolean;
  vertex_status: VertexStatus;
  isShown: boolean;
}
export interface Vertices {
  [id: number]: UiVertex;
}

// EDGES *********************************************************************
export interface RawEdge {
  id: number;
  created_at: string;
  user_id: string;
  relationship_type: Database["public"]["Enums"]["relationship_types"];

  is_active_romance: boolean;
  is_parent_child: boolean;
  parent_id: number | null;
  child_id: number | null;

  vertex_1_id: number;
  vertex_2_id: number;
}
export interface UiEdge extends RawEdge {
  vertex_1_status: VertexStatus;
  vertex_2_status: VertexStatus;
  edge_status: EdgeStatus;
}
export interface Edges {
  [id: number]: UiEdge;
}

// GROUPS *********************************************************************
export interface RawGroup {
  created_at: string;
  group_name: Database["public"]["Enums"]["group_names"] | null;
  id: number;
  user_id: string;
  parent_group_id: number | null;
}
export interface UiGroup extends RawGroup {}
export interface Groups {
  [id: number]: UiGroup;
}
