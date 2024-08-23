import { Tables } from "@/types/dbTypes";

import { INode2 } from "../types/graphManagementTypes";

export interface NodeHashObj extends Tables<"people"> {
  isShown: boolean;
  x: number;
  y: number;
}

// REMOVE: Will be removed when auth is added
const userId = 1;

export function getShownNodesAndConnections(
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  currentRootNode: INode2,
): {
  nodeHash: { [nodeId: number]: NodeHashObj };
  finalConnections: Tables<"connections">[];
} {
  let nodeHash: {
    [nodeId: number]: NodeHashObj;
  } = {};

  let defaultDepth = 2;

  allPeople.forEach((person) => {
    if (nodeHash[person.id]) return;

    nodeHash[person.id] = {
      isShown: false,
      x: 0,
      y: 0,
      ...person,
    };
  });

  // returns nodes to render if currentRootNode is user
  function setUserConnectedNodes(): void {
    allPeople.forEach((p) => {
      // show the node if depth of node is less than the default depth
      if (p.depth_from_user <= defaultDepth) {
        nodeHash[p.id].isShown = true;
      } else {
        nodeHash[p.id].isShown = false;
      }
    });
  }

  // returns nodes to render if currentRootNode is NOT user
  function setTempRootConnectedNodes(): void {
    // always show the root
    nodeHash[currentRootNode.id].isShown = true;

    allPeople.forEach((p) => {
      if (p.id === currentRootNode.id) return;

      if (p.shallowest_ancestor === currentRootNode.id) {
        nodeHash[p.id].isShown = true;
      } else {
        nodeHash[p.id].isShown = false;
      }
    });
  }

  // if currentRootNode is the user, get rootConnections
  if (currentRootNode.id === userId) {
    setUserConnectedNodes();
  } else {
    setTempRootConnectedNodes();
  }

  return {
    nodeHash,
    finalConnections: [],
  };
}

const BEFORE = {
  "1": {
    children_details: null,
    created_at: "2024-07-20T14:07:07.332245+00:00",
    date_of_birth: "2000-10-01",
    date_of_death: null,
    depth_from_user: 0,
    first_name: "Shawn",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 1,
    isShown: true,
    last_name: "Ballay",
    maiden_name: null,
    parent_details: [[Object], [Object]],
    partner_details: null,
    phonetic_name: "sh AW n",
    preferred_name: null,
    sex: "male",
    shallowest_ancestor: null,
    x: 0,
    y: 0,
  },
};

const AFTER = {
  "1": {
    children_details: null,
    created_at: "2024-07-20T14:07:07.332245+00:00",
    date_of_birth: "2000-10-01",
    date_of_death: null,
    depth_from_user: 0,
    first_name: "Shawn",
    gift_ideas: null,
    group_id: null,
    group_name: null,
    id: 1,
    isShown: true,
    last_name: "Ballay",
    maiden_name: null,
    parent_details: [[Object], [Object]],
    partner_details: null,
    phonetic_name: "sh AW n",
    preferred_name: null,
    sex: "male",
    shallowest_ancestor: null,
    x: 0,
    y: 0,
  },
};
