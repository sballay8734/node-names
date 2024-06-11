type DefaultGroup = "Friends" | "Work" | "Family"; // subcategories?

export type NodeLink = {
  source: number; // id of user
  target: number; // id of linked person
  type: string; // child, partner, friend
};

type Sex = "male" | "female";

// each node is a person
export interface NodePerson {
  id: number;
  rootNode: boolean; // only one of these (the user's node)

  firstName: string;
  lastName: string;

  group: string | null; // they can create their own groups

  // TS error when making this type Sex (idk why?)
  sex: string;
}

// symbolSize: number; based on number of connections

// x = center on screen initially (Also always have a button in top left to navigate to root node)
// y = center on screen initially

// each link is a connection from a person to someone else
