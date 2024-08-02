import { Tables } from "@/types/dbTypes";

export interface EnhancedPerson extends Tables<"people"> {
  totalConnections: number;
  hiddenConnections: number;
}

const getNthConnections = (
  nodeId: number,
  allPeople: Tables<"people">[],
  allConnections: Tables<"connections">[],
  n: 0 | 1 | 2 = 0,
): {
  people: EnhancedPerson[];
  connections: Tables<"connections">[];
} | null => {
  // get rootNode
  const rootNode = allPeople.find((p) => !p.source_node_ids);
  if (!rootNode) return null;

  const getConnectedPeople = (sourceIds: string[]): Tables<"people">[] => {
    return allPeople.filter((p) =>
      sourceIds.some((id) => p.source_node_ids?.includes(id)),
    );
  };

  const getSpousesAndChildren = (
    person: Tables<"people">,
  ): Tables<"people">[] => {
    if (!person.partner_id) return [];

    const spouse = allPeople.find((p) => p.id === person.partner_id);
    const children = spouse
      ? allPeople.filter(
          (p) =>
            p.source_node_ids?.includes(person.id.toString()) &&
            p.source_node_ids.includes(spouse.id.toString()),
        )
      : [];

    return [spouse, ...children].filter(Boolean) as Tables<"people">[];
  };

  // initialize
  let connectedPeople: EnhancedPerson[] = [];
  let sourceIds = [nodeId.toString()];

  for (let i = 0; i <= n; i++) {
    const newPeople = getConnectedPeople(sourceIds);

    newPeople.forEach((person) => {
      const spousesAndChildren = getSpousesAndChildren(person);
      const enhancedPerson: EnhancedPerson = {
        ...person,
        totalConnections: newPeople.length + spousesAndChildren.length,
        hiddenConnections: spousesAndChildren.length,
      };
      connectedPeople.push(enhancedPerson);

      // Add spouses and children as hidden connections
      spousesAndChildren.forEach((hiddenPerson) => {
        const enhancedHiddenPerson: EnhancedPerson = {
          ...hiddenPerson,
          totalConnections: 1, // Only connected to the main person
          hiddenConnections: 0,
        };
        connectedPeople.push(enhancedHiddenPerson);
      });
    });

    sourceIds = newPeople.map((p) => p.id.toString());
  }

  const enhancedRootNode: EnhancedPerson = {
    ...rootNode,
    totalConnections: connectedPeople.length,
    hiddenConnections: 0,
  };

  connectedPeople = [...new Set([...connectedPeople, enhancedRootNode])];

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
