import { INode2 } from "@/features/Graph/types/graphManagementTypes";
import { RelationshipType } from "@/types/dbTypes";

export interface PositionedNode extends d3.SimulationNodeDatum, INode2 {
  isShown: boolean;
  is_current_root: boolean;
}

export interface PositionedLink extends d3.SimulationLinkDatum<PositionedNode> {
  created_at: string;
  id: number;
  relationship_type: RelationshipType;
  strength: number;
}
