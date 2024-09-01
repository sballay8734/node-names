// TODO: Make sub groups only slightly deeper than the parent
// TODO: Should you have "child_parent_mother", "child_parent_father", etc...
// TODO: When adding a branch, it should inherit the group of the source
// TODO: If a partner pair divorces, just set partner property to null, and move one of them into the branches array of the other (user can choose)
// TODO: Make sure to add group weights or depth

export const groupsForRoot = [
  {
    person_id: 1,
    group_name: "friends",
    sub_group_of: null,
  },
  {
    person_id: 1,
    group_name: "family",
    sub_group_of: null,
  },
  {
    person_id: 1,
    group_name: "colleagues",
    sub_group_of: null,
  },
  {
    person_id: 1,
    group_name: "acquaintances",
    sub_group_of: null,
  },
  {
    person_id: 1,
    group_name: "online",
    sub_group_of: null,
  },
  {
    person_id: 1,
    group_name: "close friends",
    sub_group_of: "friends",
  },
  {
    person_id: 1,
    group_name: "distant friends",
    sub_group_of: "friends",
  },
  {
    person_id: 1,
    group_name: "really close friends",
    sub_group_of: "close friends",
  },
];

// !TODO: UniDirectional - MUST BE CONSISTENT!!
// !TODO: MAJOR NOTE - SINGLE DIRECTION RELATIONSHIPS SO SOURCE AND TARGET MUST BE CONSISTENT.

// !TODO: You CAN probably handle a target having multiple sources in unidirectional but there's really no use case for it unless it's parent_child or stepParent_child or divorcedParent_child or something like that where you can't create a combined node.

// TODO: When connecting You to Dan, then You to Katie. When you connect Katie to Dan, they essentially just both point at a "special" central node, thus keeping the uni direction nature intact
export type RelationType =
  | "partner"
  | "child"
  | "friend"
  | "parent_child"
  | "child_parent"
  | "sibling"
  | "colleague"
  | "root";

export interface Group {
  group_id: number;
  person_id: number; // person who the group is under or belongs to
  group_name: string;
  sub_group_of: string | null;
}

interface RawPerson {
  id: number;
  name: string;
  sex: "male" | "female" | "other" | null; // null is only for combined nodes
  is_special: boolean;
  // source_target_relation: RelationType; // derived from links
  source_group: string | null; // only root is null
  source_id: number | null; // only root is null
  source_ids: number[] | null; // only root is null
  bio_parent_ids: number[];
  source_target_relation: RelationType;
}
interface Edge {
  source_id: number;
  target_id: number;
  is_active: boolean; // used to hide edges that have combined
  is_parent_child: boolean;
  source_target_relation: RelationType;
}

interface DerivedPerson extends RawPerson {
  groups: Group[];
  branches: DerivedPerson[];
}

export const people: RawPerson[] = [
  {
    id: 1,
    name: "Shawn",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "root",
  },
  {
    id: 2,
    name: "Dan",
    sex: "male",
    source_group: "friends",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "friend",
  },
  {
    id: 3,
    name: "Katie",
    sex: "female",
    source_group: "friends",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "friend",
  },
  // Special nodes like below (id: 4) are the ONLY ones that can accept multiple sources (maybe kids also but we'll see)
  // {
  //   id: 4,
  //   name: "Dan & Katie",
  //   sex: null,
  //   source_group: "close friends",
  //   is_special: true,
  //   source_id: null,
  //   source_ids: [2, 3], // used to quickly reference parents if needed
  //   bio_parent_ids: [],
  //   source_target_relation: "friend",
  // },
  {
    id: 5,
    name: "Morgan",
    sex: "female",
    source_group: "family",
    is_special: false,
    source_id: 3,
    source_ids: null,
    bio_parent_ids: [2, 3],
    source_target_relation: "parent_child",
  },
  {
    id: 6,
    name: "Aaron",
    sex: "male",
    source_group: "friends",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "friend",
  },
  {
    id: 7,
    name: "Rachel",
    sex: "female",
    source_group: "family",
    is_special: false,
    source_id: 6,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "partner",
  },
  {
    id: 8,
    name: "Levi",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 7,
    source_ids: null,
    bio_parent_ids: [6],
    source_target_relation: "child_parent",
  },
  {
    id: 9,
    name: "Joe",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 6,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "child_parent",
  },
  {
    id: 10,
    name: "Carmen",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 6,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "child_parent",
  },
  {
    id: 11,
    name: "Lauren",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 10,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "parent_child",
  },
  {
    id: 12,
    name: "Eric",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 11,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "partner",
  },
  {
    id: 13,
    name: "Mackenzie",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 11,
    source_ids: null,
    bio_parent_ids: [11],
    source_target_relation: "parent_child",
  },
  {
    id: 14,
    name: "Eric's Friend",
    sex: "male",
    source_group: "friends",
    is_special: false,
    source_id: 12,
    source_ids: null,
    bio_parent_ids: [15],
    source_target_relation: "friend",
  },
  {
    id: 15,
    name: "Eric's Mom",
    sex: "female",
    source_group: "family",
    is_special: false,
    source_id: 12,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "child_parent",
  },
  {
    id: 16,
    name: "Rachel's Dad",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 7,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "child_parent",
  },
  {
    id: 17,
    name: "Carol",
    sex: "female",
    source_group: "family",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "child_parent",
  },
  {
    id: 18,
    name: "Fred",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "child_parent",
  },
  {
    id: 19,
    name: "Tara",
    sex: "female",
    source_group: "family",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "sibling",
  },
  {
    id: 20,
    name: "Kyle",
    sex: "male",
    source_group: "family",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "sibling",
  },
  {
    id: 21,
    name: "John",
    sex: "male",
    source_group: "colleagues",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "colleague",
  },
  {
    id: 22,
    name: "Jay",
    sex: "female",
    source_group: "family",
    is_special: false,
    source_id: 21,
    source_ids: null,
    bio_parent_ids: [],
    source_target_relation: "partner",
  },
];
export const edges: Edge[] = [
  {
    source_id: 1,
    target_id: 2,
    source_target_relation: "friend",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 3,
    source_target_relation: "friend",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 3,
    target_id: 5,
    source_target_relation: "parent_child",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 2,
    target_id: 5,
    source_target_relation: "parent_child",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 6,
    source_target_relation: "friend",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 17,
    source_target_relation: "child_parent",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 18,
    source_target_relation: "child_parent",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 19,
    source_target_relation: "sibling",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 20,
    source_target_relation: "sibling",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 21,
    source_target_relation: "colleague",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 6,
    target_id: 7,
    source_target_relation: "partner",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 6,
    target_id: 8,
    source_target_relation: "parent_child",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 7,
    target_id: 8,
    source_target_relation: "parent_child",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 6,
    target_id: 9,
    source_target_relation: "child_parent",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 6,
    target_id: 10,
    source_target_relation: "child_parent",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 10,
    target_id: 11,
    source_target_relation: "parent_child",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 11,
    target_id: 12,
    source_target_relation: "partner",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 11,
    target_id: 13,
    source_target_relation: "parent_child",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 12,
    target_id: 14,
    source_target_relation: "friend",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 12,
    target_id: 15,
    source_target_relation: "child_parent",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 7,
    target_id: 16,
    source_target_relation: "child_parent",
    is_parent_child: true,
    is_active: true,
  },
  {
    source_id: 21,
    target_id: 22,
    source_target_relation: "partner",
    is_parent_child: false,
    is_active: true,
  },
];
export const groups: Group[] = [
  {
    group_id: 1,
    person_id: 1,
    group_name: "friends",
    sub_group_of: null,
  },
  {
    group_id: 2,
    person_id: 1,
    group_name: "family",
    sub_group_of: null,
  },
  {
    group_id: 3,
    person_id: 1,
    group_name: "close friends",
    sub_group_of: "friends",
  },
  {
    group_id: 4,
    person_id: 1,
    group_name: "colleagues",
    sub_group_of: null,
  },
  {
    group_id: 5,
    person_id: 1,
    group_name: "acquaintances",
    sub_group_of: null,
  },
  {
    group_id: 6,
    person_id: 1,
    group_name: "REALLY close friends",
    sub_group_of: "close friends",
  },
  {
    group_id: 7,
    person_id: 3,
    group_name: "family",
    sub_group_of: null,
  },
  {
    group_id: 8,
    person_id: 6,
    group_name: "family",
    sub_group_of: null,
  },
  {
    group_id: 9,
    person_id: 7,
    group_name: "family",
    sub_group_of: null,
  },
  {
    group_id: 10,
    person_id: 10,
    group_name: "family",
    sub_group_of: null,
  },
  {
    group_id: 11,
    person_id: 11,
    group_name: "family",
    sub_group_of: null,
  },
  {
    group_id: 12,
    person_id: 12,
    group_name: "friends",
    sub_group_of: null,
  },
  {
    group_id: 13,
    person_id: 12,
    group_name: "family",
    sub_group_of: null,
  },
  {
    group_id: 14,
    person_id: 21,
    group_name: "family",
    sub_group_of: null,
  },
];
export const finalShape: DerivedPerson = {
  id: 1,
  name: "Shawn",
  sex: "male",
  source_group: null,
  is_special: false,
  source_id: null,
  source_ids: null,
  bio_parent_ids: [],
  source_target_relation: "root",
  groups: [...groups],
  branches: [
    {
      id: 2,
      name: "Dan",
      sex: "male",
      source_group: "friends",
      is_special: false,
      source_id: 1,
      source_ids: null,
      bio_parent_ids: [],
      source_target_relation: "friend",
      groups: [],
      branches: [],
    },
    {
      id: 3,
      name: "Katie",
      sex: "female",
      source_group: "friends",
      is_special: false,
      source_id: 1,
      source_ids: null,
      bio_parent_ids: [],
      source_target_relation: "friend",
      groups: [
        { group_id: 7, person_id: 3, group_name: "family", sub_group_of: null },
      ],
      branches: [
        {
          id: 5,
          name: "Morgan",
          sex: "female",
          source_group: "family",
          is_special: false,
          source_id: 3,
          source_ids: null,
          bio_parent_ids: [3],
          source_target_relation: "parent_child",
          groups: [],
          branches: [],
        },
      ],
    },
  ],
};

// loop through the edges
// everytime you find a new source id, get the person
// then get all the groups for that source and add them to the groups array
// if edge.is_active === false SKIP
// OTHERWISE, get the person where person_id === target_id
// then use the source_target_relation as source_target_relation

function getFinalTree(array: Edge[]) {
  let peopleMap: { [id: number]: DerivedPerson } = {};
  let groupMap: { [id: number]: Group[] } = {};

  // !TODO: MAKE EDGES MAP ALSO TO EASILY CHECK WHAT YOU NEED

  // get groups first
  groups.forEach((g) => {
    if (!groupMap[g.person_id]) {
      groupMap[g.person_id] = [g];
    } else {
      groupMap[g.person_id] = [...groupMap[g.person_id], g];
    }
  });

  // initialize extra fields and spread groups
  people.forEach((p) => {
    if (!groupMap[p.id]) {
      peopleMap[p.id] = {
        ...p,
        groups: [],
        branches: [],
      };
    } else {
      peopleMap[p.id] = {
        ...p,
        groups: [...groupMap[p.id]],
        branches: [],
      };
    }
  });

  // !TODO: I THINK YOU NEED TO GO BOTTOM UP SOMEHOW (DEPTH FIRST)
  // TODO: first you need to find the ROOT
  // map through the edges to create people
  edges.forEach((e) => {
    if (!peopleMap[e.source_id] || !peopleMap[e.target_id]) {
      console.log("MISSING PERSON!");
      return;
    } else if (!e.is_active) {
      return;
    } else {
      const target = peopleMap[e.target_id];
      const source = peopleMap[e.source_id];

      source.branches = [...source.branches, target];
    }
  });
}

// FULL FLOW OF CREATING A NEW PERSON
// 1. Every new node (target) MUST have a SINGLE source (for now) it stems from
// 2. START:
// -> all groups are stored separately

// -> User clicks on and selects a node (source)
// -> User clicks "+" button to add a connection to a new node
// -> show dialog/form to complete
// -> User MUST input "name", select relation to source, select a sex/gender, check whether or not this is a parent_child relationship, and select a group for the new node (can just be default group)
// ->
// -> User finalizes details and clicks "create"
// -> A new node will be created with the following values
/* 
  {
    id: created by DB,
    name: The name the user input,
    sex: "male" | "female" | null,
    source_group: The group the user selected (or "default"),
    is_special: false (this will only be true when creating combined nodes),
    source_id: The id of the node the action was initialized from,
    source_ids: Only for combined nodes,
    bio_parent_ids: [if is_parent_child was true put source in here also],
    source_target_relation: whatever user chose
    groups: [],
    branches: []
  } 
*/

// -> A new Edge will ALSO be created as a trigger on the DB as follows:
/* 
  {
    source_id: The id of the node the action was initialized from,
    target_id: The new_id of the new node provided by the DB,
    source_target_relation: whatever the user selected,
    is_parent_child: whatever the user selected,
    is_active: true (defaults to true),
  }
*/

// If opeation successful (do last step)

// -> CLIENT: push new node to the "branches" array of the source

// IF NODE IS PARENT_CHILD
// Create a family group for the source if one doesn't exist and send to DB

// TO CONNECT Dan to Morgan if Morgan is only connected to Katie AND Katie and Dan are NOT connected
// -> Prompt user (are you and "Katie" still together?)
// if YES -> combinedNode()
// if NO -> STILL ADD THE EDGE AND Just add Dan's id to Morgan's bio_parent_ids array within Katie's branches and in the DB
