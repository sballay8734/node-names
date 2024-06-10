type DefaultGroup = "Friends" | "Work" | "Family"; // subcategories?

type Link = {
  source: string | string[]; // id of user
  target: string; // id of linked person
  type: string; // child, partner, friend
};

// each node is a person
interface Node {
  id: number;
  rootNode: boolean; // only one of these (the user's node)

  firstname: string;
  lastName: string;

  group: string | null; // they can create their own groups

  sex: "male" | "female";

  // symbolSize: number; based on number of connections

  // x = center on screen initially (Also always have a button in top left to navigate to root node)
  // y = center on screen initially
}

// each link is a connection from a person to someone else
