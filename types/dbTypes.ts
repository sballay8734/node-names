type RelationshipType =
  | "friend"
  | "spouse"
  | "parent_child_biological"
  | "parent_child_non_biological"
  | "grandparent_grandchild"
  | "sibling_in_law"
  | "parent_child_in_law"
  | "sibling"
  | "half_sibling"
  | "step_sibling"
  | "coworker"
  | "neighbor"
  | "romantic_partner"
  | "ex_spouse"
  | "cousin"
  | "uncle_aunt"
  | "niece_nephew_by_blood"
  | "niece_nephew_by_marriage"
  | "grandparent"
  | "grandchild"
  | "roommate"
  | "family_friend"
  | "acquaintance";

export interface Person {
  id: number;
  firstName: string;
  lastName: string | null;
  maidenName: string | null;
  groupId: number | null;
  sex: "male" | "female" | "other";
  // birthDate: Date;
  // giftIdeas: string[];
  // phoneticName: string;
}

export interface Connection {
  person1Id: number;
  person2Id: number;
  relationshipType: RelationshipType;
}

export interface Group {
  id: number;
  name: string;
  parentGroupId: number | null;
}
