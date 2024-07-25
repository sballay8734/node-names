import { Tables } from "@/types/dbTypes";

import { PositionedPerson } from "./positionGraphElements";

export default function getPrimaryConnectionsAndNodes(
  node: PositionedPerson,
  connections: Tables<"connections">[],
  people: PositionedPerson[],
) {
  // return all connections where the source OR target === input node.id
  const primaryConnections = connections.filter(
    (c) => c.person_1_id === node.id || c.person_2_id === node.id,
  );

  // get ids where inpout node is source/target (does NOT return input node id)
  const targetIds = primaryConnections.map((c) =>
    c.person_1_id === node.id ? c.person_2_id : c.person_1_id,
  );

  // get all nodes connected to the input node
  const primaryNodes =
    targetIds && people && people.filter((p) => targetIds.includes(p.id));

  return { primaryConnections, primaryNodes: [...primaryNodes, node] };
}
