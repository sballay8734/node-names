import { Tables } from "@/types/dbTypes";

import { PositionedPerson } from "./positionGraphElements";

export default function getPrimaryConnections(
  node: PositionedPerson,
  connections: Tables<"connections">[],
) {
  // return all connections where the source OR target === node.id
  const primaryConnections = connections.filter(
    (c) => c.person_1_id === node.id || c.person_2_id === node.id,
  );

  return primaryConnections;
}
