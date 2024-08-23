import { Child, Parent, Partner } from "@/types/dbTypes";

export interface INode2 {
  id: number;
  created_at: string;
  first_name: string;
  sex: string;

  group_id: number | null;
  group_name: string | null;
  last_name: string | null;
  maiden_name: string | null;
  preferred_name: string | null;
  phonetic_name: string | null;

  date_of_birth: string | null;
  date_of_death: string | null;
  gift_ideas: string[] | null;

  partner_details: Partner[] | null;
  parent_details: Parent[] | null;
  children_details: Child[] | null;

  depth_from_user: number;
  shallowest_ancestor: number;

  isShown: boolean;
  is_current_root: boolean;
}

// !TODO: Current issue is that you're calculating shown/hidden connections at run time, thus you had to alter the interfaces to make it work (not ideal)
export interface TempTillDbFix
  extends Omit<INode2, "shownConnections" | "hiddenConnections"> {}
