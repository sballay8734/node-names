import * as d3 from "d3";

import { WindowSize } from "@/hooks/useWindowSize";
import { RelationshipType, Sex, Tables } from "@/types/dbTypes";

export interface PositionedPersonNode extends Tables<"people"> {
  nodeX: number;
  nodeY: number;
}

export interface PositionedPerson extends d3.SimulationNodeDatum {
  created_at: string;
  first_name: string;
  group_id: number | null;
  id: number;
  isRoot: boolean | null;
  last_name: string | null;
  maiden_name: string | null;
  phonetic_name: string | null;
  sex: Sex;
}

export interface FinalizedLink {
  created_at: string;
  id: number;
  index: number;
  person_1_id: number;
  person_2_id: number;
  relationship_type: RelationshipType;
  strength: number;
  source: {
    created_at: string;
    first_name: string;
    fx: number;
    fy: number;
    group_id: number | null;
    id: number;
    index: number;
    isRoot: boolean;
    last_name: string | null;
    maiden_name: string | null;
    phonetic_name: string | null;
    sex: Sex;
    vx: number;
    vy: number;
    x: number;
    y: number;
  };
  target: {
    created_at: string;
    first_name: string;
    fx: number;
    fy: number;
    group_id: number | null;
    id: number;
    index: number;
    isRoot: boolean;
    last_name: string | null;
    maiden_name: string | null;
    phonetic_name: string | null;
    sex: Sex;
    vx: number;
    vy: number;
    x: number;
    y: number;
  };
}

export interface PositionedLink
  extends d3.SimulationLinkDatum<PositionedPerson> {
  created_at: string;
  id: number;
  person_1_id: number;
  person_2_id: number;
  relationship_type: RelationshipType;
  strength: number;
}

export interface Link {
  created_at: string;
  id: number;
  person_1_id: number;
  person_2_id: number;
  relationship_type: RelationshipType;
}

export type SimulationResult = {
  nodes: PositionedPerson[];
  links: PositionedLink[];
};

// then do something here (start with links and nodes)
export function handleGrouping(groups: Tables<"groups">[]) {}

// HELPERS ********************************************************************
export function calculatePositions(
  people: Tables<"people">[],
  connections: Tables<"connections">[],
  windowSize: WindowSize,
): SimulationResult {
  // Create a copy of people and links
  const peopleCopy: PositionedPerson[] = people.map((p) => ({ ...p }));
  const linksCopy: Link[] = connections.map((p) => ({ ...p }));

  // Find the root node and set its fixed position
  const rootNode = peopleCopy.find((p) => p.isRoot === true);
  if (rootNode) {
    (rootNode as PositionedPerson).fx = windowSize.windowCenterX;
    (rootNode as PositionedPerson).fy = windowSize.windowCenterY;
  }

  function getConnectionStrength(connection: Link) {
    const cType = connection.relationship_type;
    if (cType === "spouse") {
      return 2; // Increase strength for spouses
    } else if (
      cType === "parent_child_biological" ||
      cType === "parent_child_non_biological"
    ) {
      return 1.5; // Increase strength for parent-child
    } else if (cType === "sibling") {
      return 1;
    } else return 0.5;
  }

  // Create the links array that D3 force layout expects
  const positionedLinks: PositionedLink[] = linksCopy.map((connection) => ({
    ...connection,
    strength: getConnectionStrength(connection),
    source: connection.person_1_id,
    target: connection.person_2_id,
  }));

  const simulation = d3
    .forceSimulation<PositionedPerson, PositionedLink>(peopleCopy)

    // Create space around the root node and min space around non-root nodes
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((node) => ((node as PositionedPerson).isRoot ? 300 : 25))
        .strength(0.5), // Adjust collision strength
    )

    // Center the nodes around screen center
    .force(
      "center",
      d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    )

    // Pull linked nodes closer together
    .force(
      "link",
      d3
        .forceLink<PositionedPerson, PositionedLink>(positionedLinks)
        .id((link) => link.id)
        .distance((link) => {
          const baseDistance = 100; // Base distance
          return baseDistance * (1 / link.strength); // Adjust distance based on strength
        })
        .strength((link) => link.strength), // Adjust link strength
    )

    // Add a weak repulsion force
    .force("charge", d3.forceManyBody().strength(-30));

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return { nodes: peopleCopy, links: positionedLinks as FinalizedLink[] };
}

// takes a TapDetector and returns is x and y value on the screen
export function smallToBig(node: PositionedPerson, scaleFactor: number) {
  const x = node.x! / scaleFactor;
  const y = node.y! / scaleFactor;

  return { x, y };
}

// !TODO: NEW STRATEGY
// 1. Get primary nodes
// 2. Determine widget value based on # of primary nodes connections
// 3. Group primary nodes (friends, coworkers, etc)
// 4. Render
// 5. On "inspect" click of primary node -> show node connection hierarchy
