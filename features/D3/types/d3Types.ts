import { INode2 } from "@/features/Graph/redux/graphManagement";

export interface PositionedNode extends d3.SimulationNodeDatum, INode2 {}

export interface PositionedLink extends d3.SimulationLinkDatum<PositionedNode> {
  created_at: string;
  id: number;
  relationship_type: string;
  strength: number;
}
