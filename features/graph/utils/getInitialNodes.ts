import { Tables } from "@/types/dbTypes";

export interface NodeHashObj extends Tables<"people"> {
  isShown: boolean;
  x: number;
  y: number;
}

// allPeople will have the rootNode where is_current_root === true
export function getInitialNodes(
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
): {
  nodeHash: { [nodeId: number]: NodeHashObj };
  finalConnections: Tables<"connections">[];
} {
  let nodeHash: {
    [nodeId: number]: NodeHashObj;
  } = {};

  let defaultDepth = 2;

  // initialize the hashObj
  allPeople.forEach((person) => {
    if (nodeHash[person.id]) return;

    nodeHash[person.id] = {
      isShown: false,
      x: 0,
      y: 0,
      ...person,
    };
  });

  function setUserConnectedNodes(): void {
    allPeople.forEach((p) => {
      if (p.depth_from_user <= defaultDepth) {
        nodeHash[p.id].isShown = true;
      } else {
        nodeHash[p.id].isShown = false;
      }
    });
  }

  setUserConnectedNodes();

  return {
    nodeHash,
    finalConnections: [],
  };
}
