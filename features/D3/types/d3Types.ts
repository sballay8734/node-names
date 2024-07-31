import { RelationshipType, Sex } from "@/types/dbTypes";

// MAIN TYPES *****************************************************************
export interface INode extends d3.SimulationNodeDatum {
  created_at: string;
  first_name: string;
  group_id: number | null;
  id: number;
  isRoot: boolean | null;
  last_name: string | null;
  maiden_name: string | null;
  phonetic_name: string | null;
  sex: Sex;
}

export interface ILink {
  created_at: string;
  id: number;
  index: number;
  person_1_id: number;
  person_2_id: number;
  relationship_type: RelationshipType;
  strength: number;
  source: {
    created_at: string;
    first_name: string;
    fx: number;
    fy: number;
    group_id: number | null;
    id: number;
    index: number;
    isRoot: boolean;
    last_name: string | null;
    maiden_name: string | null;
    phonetic_name: string | null;
    sex: Sex;
    vx: number;
    vy: number;
    x: number;
    y: number;
  };
  target: {
    created_at: string;
    first_name: string;
    fx: number;
    fy: number;
    group_id: number | null;
    id: number;
    index: number;
    isRoot: boolean;
    last_name: string | null;
    maiden_name: string | null;
    phonetic_name: string | null;
    sex: Sex;
    vx: number;
    vy: number;
    x: number;
    y: number;
  };
}

// HELPER TYPES ***************************************************************
export interface Link {
  created_at: string;
  id: number;
  person_1_id: number;
  person_2_id: number;
  relationship_type: RelationshipType;
}

export interface PositionedLink extends d3.SimulationLinkDatum<INode> {
  created_at: string;
  id: number;
  person_1_id: number;
  person_2_id: number;
  relationship_type: RelationshipType;
  strength: number;
}

export type SimulationResult = {
  nodes: INode[];
  links: PositionedLink[];
};
