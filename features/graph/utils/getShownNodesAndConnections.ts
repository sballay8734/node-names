import { EnhancedPerson } from "@/features/D3/utils/getNodePositions";
import { Tables } from "@/types/dbTypes";

import {
  getSourceValidConns,
  getValidConns,
} from "../helpers/nodesAndConnections";
import { INode2 } from "../redux/graphManagement";

// REMOVE: Will be removed when auth is added
const userId = 1;

export function getShownNodesAndConnections(
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  currentRootNode: INode2,
): {
  shownNodes: EnhancedPerson[];
  finalConnections: Tables<"connections">[];
} {
  // 1 if userIsInspected, 2 if it's someone else
  let depth: 1 | 2 = currentRootNode.id === userId ? 1 : 2;

  const formattedPeople: EnhancedPerson[] = allPeople.map((p) => {
    return {
      ...p,
      hiddenConnections: 0,
      shownConnections: 0,
    };
  });

  // !TODO: Derive connections here then add them
  const derivedConnections = formattedPeople.flatMap((p) => {
    if (p.partner_details) {
      let childConnections: Tables<"connections">[] = [];
      p.partner_details.forEach((partner) => {
        if (partner.children_ids && partner.children_ids.length) {
          const childrenIds = partner.children_ids;
          childrenIds.forEach((childId) => {
            childConnections.push({
              created_at: new Date().toISOString(),
              id: Math.random() * 10000000,
              relationship_type: "parent_child_biological",
              source_node_id: p.id,
              target_node_id: childId,
              relationship_details: {
                child: Number(childId),
                parent: Number(p.id),
              },
            });
          });
        }
      });
      return childConnections;
    }
    return []; // Return an empty array if there are no partner details
  });

  // FIRST: format ALL connections so that parents are ALWAYS source
  const formattedConnections = [
    ...derivedConnections,
    ...allConnections.map((c) => {
      if (c.relationship_type === "parent_child_biological") {
        const source = c.relationship_details.parent;
        const target = c.relationship_details.child;
        return {
          ...c,
          source_node_id: source,
          target_node_id: target,
        };
      } else {
        return c;
      }
    }),
  ];

  // get direct connections of root and ids of those connections
  const initalConns = getSourceValidConns(
    currentRootNode.id,
    formattedConnections,
    currentRootNode.id,
  );
  const includedConnIds = initalConns.map((c) => c.id);

  // initialize the rootNode's combined node IDs
  let combinedNodeIds = [
    ...Array.from(
      new Set(
        initalConns
          .filter((c) => c.source_node_id === currentRootNode.id)
          .map((c) => c.target_node_id),
      ),
    ),
    ...Array.from(
      new Set(
        initalConns
          .filter((c) => c.target_node_id === currentRootNode.id)
          .map((c) => c.source_node_id),
      ),
    ),
  ];

  // continue looping until all "nested" connections are found
  while (combinedNodeIds.length) {
    let finalConns: Tables<"connections">[] = [];

    combinedNodeIds.forEach((id) => {
      const validConns = getValidConns(id, formattedConnections, false);
      const connIds = Array.from(new Set(validConns.map((c) => c.id)));

      const finalConnections = formattedConnections.filter(
        (c) => connIds.includes(c.id) && !includedConnIds.includes(c.id),
      );

      const finalConnIds = Array.from(
        new Set(finalConnections.map((c) => c.id)),
      );

      finalConns.push(...finalConnections);
      includedConnIds.push(...finalConnIds);
    });

    const newConnIds = Array.from(new Set(finalConns.map((c) => c.id)));
    const newConns = formattedConnections.filter((c) =>
      newConnIds.includes(c.id),
    );

    const newTargetIds = [
      ...Array.from(new Set(newConns.map((c) => c.target_node_id))),
      ...Array.from(new Set(newConns.map((c) => c.source_node_id))),
    ];

    // console.log("NEW TARGET IDS:", newTargetIds);

    combinedNodeIds = [...newTargetIds];

    if (!newTargetIds.length) break; // end loop
  }

  const finalConnectionsToRender = formattedConnections.filter((c) =>
    includedConnIds.includes(c.id),
  );
  const finalNodeIdsToRender = Array.from(
    new Set(
      finalConnectionsToRender.flatMap((c) => [
        c.source_node_id,
        c.target_node_id,
      ]),
    ),
  );
  const finalNodesToRender = formattedPeople.filter((p) =>
    finalNodeIdsToRender.includes(p.id),
  );

  return {
    shownNodes: finalNodesToRender,
    finalConnections: finalConnectionsToRender,
  };
}

// !TODO: incorporate "depth" in the function

// !TODO: MAJOR: Rachel and Joe BOTH didn't have connections to their spouse in the DB. BUT because Aaron was processed before Rachel, there was no error. In Joe's case though, Joe was process first and an error was thrown because Joe never appeared in the connObj since he didn't have a connection in the DB. You NEED to make sure either, 1. connections are always created for BOTH spouses OR you need to change the logic above so that it doesn't matter
