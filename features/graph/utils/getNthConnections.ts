import { EnhancedPerson } from "@/features/D3/utils/getNodePositions";
import { Tables } from "@/types/dbTypes";

const getNthConnections = (
  nodeId: number,
  allPeople: EnhancedPerson[],
  allConnections: Tables<"connections">[],
  n: 0 | 1 | 2 = 0,
): {
  people: EnhancedPerson[];
  connections: Tables<"connections">[];
} | null => {
  const rootNode = allPeople.find((p) => !p.source_node_ids);
  if (!rootNode) return null;

  const getConnectedPeople = (sourceIds: string[]): EnhancedPerson[] => {
    return allPeople.filter((p) =>
      sourceIds.some((id) => p.source_node_ids?.includes(id)),
    );
  };

  const getSpousesAndChildren = (
    people: EnhancedPerson[],
  ): EnhancedPerson[] => {
    return people.flatMap((person) => {
      if (!person.partner_id) return [];

      const spouse = allPeople.find((p) => p.id === person.partner_id);
      const children = spouse
        ? allPeople.filter(
            (p) =>
              p.source_node_ids?.includes(person.id.toString()) &&
              p.source_node_ids.includes(spouse.id.toString()),
          )
        : [];

      return [spouse, ...children].filter(Boolean) as EnhancedPerson[];
    });
  };

  let connectedPeople: EnhancedPerson[] = [];
  let sourceIds = [nodeId.toString()];

  for (let i = 0; i <= n; i++) {
    const newPeople = getConnectedPeople(sourceIds);
    connectedPeople = [...connectedPeople, ...newPeople];
    sourceIds = newPeople.map((p) => p.id.toString());

    if (i === 0) {
      const spousesAndChildren = getSpousesAndChildren(newPeople);
      connectedPeople = [...connectedPeople, ...spousesAndChildren];
    }
  }

  connectedPeople = [...new Set([...connectedPeople, rootNode])];

  const connectedPeopleIds = new Set(connectedPeople.map((p) => p.id));

  const relevantConnections = allConnections.filter(
    (conn) =>
      connectedPeopleIds.has(conn.source_node_id) &&
      connectedPeopleIds.has(conn.target_node_id),
  );

  return {
    people: connectedPeople,
    connections: relevantConnections,
  };
};

export { getNthConnections };
