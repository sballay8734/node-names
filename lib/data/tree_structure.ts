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
  | "friend"
  | "parent_child"
  | "child_parent"
  | "sibling"
  | "colleague"
  | "root";

export interface Group {
  person_id: number; // person who the group is under or belongs to
  group_name: string;
  sub_group_of: string | null;
}

interface RawPerson {
  id: number;
  name: string;
  sex: "male" | "female" | "other" | null; // null is only for combined nodes
  is_special: boolean;
  // relation_to_source: RelationType; // derived from links
  source_group: string | null; // only root is null
  source_id: number | null; // only root is null
  source_ids: number[] | null; // only root is null
  bio_parent_ids: number[];
}
interface Edge {
  source_id: number;
  target_id: number;
  is_active: boolean; // used to hide edges that have combined
  is_parent_child: boolean;
  relation_to_source: RelationType;
}

interface DerivedPerson extends RawPerson {
  relation_to_source: RelationType;
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
  },
  {
    id: 3,
    name: "Katie",
    sex: "female",
    source_group: "close friends",
    is_special: false,
    source_id: 1,
    source_ids: null,
    bio_parent_ids: [],
  },
  // Special nodes like below (id: 4) are the ONLY ones that can accept multiple sources (maybe kids also but we'll see)
  {
    id: 4,
    name: "Dan & Katie",
    sex: null,
    source_group: "close friends",
    is_special: true,
    source_id: null,
    source_ids: [2, 3], // used for reference to look up "creators"
    bio_parent_ids: [],
  },
  {
    id: 5,
    name: "Morgan",
    sex: "female",
    source_group: "close friends",
    is_special: false,
    source_id: 4,
    source_ids: null,
    bio_parent_ids: [2, 3],
  },
  {
    id: 6,
    name: "Aaron",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 7,
    name: "Rachel",
    sex: "female",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 8,
    name: "Levi",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 9,
    name: "Joe",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 10,
    name: "Carmen",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 11,
    name: "Lauren",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 12,
    name: "Eric",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 13,
    name: "Mackenzie",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 14,
    name: "Eric's Friend",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 15,
    name: "Eric's Mom",
    sex: "female",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 16,
    name: "Rachel's Dad",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 17,
    name: "Carol",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 18,
    name: "Fred",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 19,
    name: "Tara",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 20,
    name: "Kyle",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 21,
    name: "John",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
  {
    id: 22,
    name: "Jay",
    sex: "female",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },

  {
    id: 22,
    name: "NEW PERSON",
    sex: "female",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
  },
];
export const edges: Edge[] = [
  {
    source_id: 1,
    target_id: 2,
    relation_to_source: "friend",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 1,
    target_id: 3,
    relation_to_source: "friend",
    is_parent_child: false,
    is_active: false,
  },
  {
    source_id: 1,
    target_id: 4,
    relation_to_source: "friend",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 2,
    target_id: 4,
    relation_to_source: "friend",
    is_parent_child: false,
    is_active: true,
  },
  {
    source_id: 3,
    target_id: 4,
    relation_to_source: "friend",
    is_parent_child: false,
    is_active: true,
  },
];

export const groups: Group[] = [
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
    group_name: "close friends",
    sub_group_of: "friends",
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
    group_name: "REALLY close friends",
    sub_group_of: "close friends",
  },
];

// loop through the edges
// everytime you find a new source id, get the person
// then get all the groups for that source and add them to the groups array
// if edge.is_active === false SKIP
// OTHERWISE, get the person where person_id === target_id
// then use the relation_to_source as relation_to_source

export const peopleAfterDerivation: DerivedPerson[] = [
  {
    id: 1,
    name: "Shawn",
    sex: "male",
    source_group: null,
    is_special: false,
    source_id: null,
    source_ids: null,
    bio_parent_ids: [],
    relation_to_source: "root",
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
        relation_to_source: "friend",
        groups: [],
        branches: [],
      },
    ],
  },
];

// FULL FLOW OF CREATING A NEW PERSON
// 1. Every new node (target) MUST have a SINGLE source (for now) it stems from
// 2. START:
// -> all groups are stored separately

// -> User clicks on and selects a node (source)
// -> User clicks "+" button to add a connection to a new node
// -> show dialog/form to complete
// -> User MUST input "name", select relation to source, check whether or not this is a parent_child relationship, and select a group for the new node (can just be default group)
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
    relation_to_source: 
    groups: [],
    branches: []
  } 
*/

// -> A new Edge will ALSO be created as a trigger on the DB as follows:
/* 
  {
    source_id: The id of the node the action was initialized from,
    target_id: The new_id of the new node provided by the DB,
    relation_to_source: whatever the user selected,
    is_parent_child: whatever the user selected,
    is_active: true (defaults to true),
  }
*/

// If opeation successful (do last step)

// -> CLIENT: push new node to the "branches" array of the source
