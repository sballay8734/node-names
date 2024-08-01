import { INode } from "@/features/D3/types/d3Types";
import { RelationshipType, Tables } from "@/types/dbTypes";

export interface IConnectionsAndNodes {
  connections: {
    [id: number]: {
      id: number;
      created_at: string;
      person_1_id: number;
      person_2_id: number;
      relationship_type: RelationshipType;
    };
  };
  nodes: {
    [id: number]: INode;
  };
  connectionIds: number[];
  nodeIds: number[];
}

export default function getNodeConnections(
  node: INode,
  allConnections: Tables<"connections">[],
  allPeople: INode[],
  rootNode: INode,
): IConnectionsAndNodes {
  // return all connections where the source OR target === input node.id
  const nodeConnections = allConnections.filter(
    (c) => c.person_1_id === node.id || c.person_2_id === node.id,
  );

  // get ids where input node is source/target (does NOT return input node id)
  const connectedNodeIds = nodeConnections.map((c) =>
    c.person_1_id === node.id ? c.person_2_id : c.person_1_id,
  );

  // get all nodes connected to the input node
  const connectedNodes = allPeople.filter((p) =>
    connectedNodeIds.includes(p.id),
  );

  // create result structure
  const result: IConnectionsAndNodes = {
    connections: {},
    nodes: {},
    connectionIds: [],
    nodeIds: [],
  };

  // populate primaryConnections
  nodeConnections.forEach((connection) => {
    // Only include the connection if it's not to the root node (unless the input node is the root)
    if (
      node.id === rootNode.id ||
      (connection.person_1_id !== rootNode.id &&
        connection.person_2_id !== rootNode.id)
    ) {
      result.connections[connection.id] = {
        id: connection.id,
        created_at: connection.created_at,
        person_1_id: connection.person_1_id,
        person_2_id: connection.person_2_id,
        relationship_type: connection.relationship_type,
      };
      result.connectionIds.push(connection.id);
    }
  });

  // populate primaryNodes
  [...connectedNodes, node].forEach((node) => {
    result.nodes[node.id] = node;
    result.nodeIds.push(node.id);
  });

  return result;
}
