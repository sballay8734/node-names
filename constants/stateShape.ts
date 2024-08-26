// NEW STATE SHAPE ************************************************************
import { INode2 } from "@/features/Graph/types/graphManagementTypes";
import { RelationshipType } from "@/types/dbTypes";

interface State {
  user: {};
  nodes: {
    byId: {}; // also contains "isShown" field
    allIds: [];
  };
  edges: {
    byId: {};
    allIds: [];
  };
  ui: {
    activeRoot: INode2;
  };
}

interface Edge {
  sourceNodeId: number;
  targetNodeId: number;
  relationshipType: RelationshipType; // "ex_partner" & "partner"
  roles: ParentChildDetails | null;
}

interface ParentChildDetails {
  parent: number;
  child: number;
}
