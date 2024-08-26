import { Child, Parent, Partner } from "@/types/dbTypes";

export interface INode2 {
  id: number; // DONE
  created_at: string; // DONE
  first_name: string; // DONE
  sex: string; // DONE

  group_id: number | null;
  group_name: string | null;
  last_name: string | null; // DONE
  maiden_name: string | null; // DONE
  preferred_name: string | null; // DONE
  phonetic_name: string | null; // DONE

  date_of_birth: string | null; // DONE
  date_of_death: string | null; // DONE
  gift_ideas: string[] | null; // DONE

  partner_details: Partner[] | null; // REMOVE
  parent_details: Parent[] | null; // REMOVE
  children_details: Child[] | null; // REMOVE

  depth_from_user: number; // REMOVE
  shallowest_ancestor: number; // REMOVE

  isShown: boolean; // REMOVE
  is_current_root: boolean; // REMOVE
}

// !TODO: Current issue is that you're calculating shown/hidden connections at run time, thus you had to alter the interfaces to make it work (not ideal)
export interface TempTillDbFix
  extends Omit<INode2, "shownConnections" | "hiddenConnections"> {}

export interface TestVertex {
  id: number; // DONE
  created_at: string; // DONE
  first_name: string; // DONE
  sex: string; // DONE

  group_id: number | null; // DONE
  last_name: string | null; // DONE
  maiden_name: string | null; // DONE
  preferred_name: string | null; // DONE
  phonetic_name: string | null; // DONE

  date_of_birth: string | null; // DONE
  date_of_death: string | null; // DONE

  gift_ideas: string[] | null; // DONE
}
