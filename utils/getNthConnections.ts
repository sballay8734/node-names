import { Tables } from "@/types/dbTypes";

const functionMap = {
  0: (
    nodeId: number,
    people: Tables<"people">[],
    connections: Tables<"connections">[],
  ): { people: Tables<"people">[]; connections: Tables<"connections">[] } => {
    const directConnections = people.filter((p) =>
      p.source_node_ids?.includes(nodeId.toString()),
    );

    const spousesAndChildren = directConnections.flatMap((connection) => {
      if (!connection.partner_id) return [];

      // get spouse
      const spouse = people.find((p) => p.partner_id === connection.id);

      // get children
      const children =
        spouse &&
        people.filter(
          (p) =>
            p.source_node_ids?.includes(spouse?.id.toString()) &&
            p.source_node_ids.includes(connection.id.toString()),
        );

      return [spouse, ...(children || [])].filter(
        Boolean,
      ) as Tables<"people">[];
    });

    return {
      people: [...directConnections, ...spousesAndChildren].filter(
        Boolean,
      ) as Tables<"people">[],
      connections: connections.filter(Boolean) as Tables<"connections">[],
    };
  },
  1: () => ({ people: [], connections: [] }),
  2: () => ({ people: [], connections: [] }),
};

export function getNthConnections(
  nodeId: number,
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  n: 0 | 1 | 2 = 0,
): { people: Tables<"people">[]; connections: Tables<"connections">[] } | null {
  const result = functionMap[n](nodeId, allPeople, allConnections);

  if (result) {
    return result;
  }

  return null;
}
