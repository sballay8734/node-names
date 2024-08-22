import { Tables } from "@/types/dbTypes";

import { INode2 } from "../redux/graphManagement";

export interface NodeHashObj {
  isShown: boolean;
  xPosition: number;
  yPosition: number;
  node: Tables<"people">;
}

// REMOVE: Will be removed when auth is added
const userId = 1;

export function getShownNodesAndConnections(
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  currentRootNode: INode2,
): {
  nodeObj: { [nodeId: number]: NodeHashObj };
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
      xPosition: 0,
      yPosition: 0,
      node: person,
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
    allPeople.forEach((p) => {
      if (p.shallowest_ancestor === currentRootNode.id) {
        nodeHash[p.id].isShown = true;
      } else {
        nodeHash[p.id].isShown = false;
      }

      // always show the root
      nodeHash[currentRootNode.id].isShown = true;
    });
  }

  // if currentRootNode is the user, get rootConnections
  if (currentRootNode.id === userId) {
    setUserConnectedNodes();
  } else {
    setTempRootConnectedNodes();
  }

  // console.log("HASH:", JSON.stringify(nodeHash));

  return {
    nodeObj: nodeHash,
    // finalConnections: finalConnectionsToRender,
    finalConnections: [],
  };
}
