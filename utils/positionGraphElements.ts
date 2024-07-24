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

  // Create the links array that D3 force layout expects
  const unpositionedLinks: PositionedLink[] = linksCopy.map((connection) => ({
    ...connection,
    source: connection.person_1_id,
    target: connection.person_2_id,
  }));

  // Create the simulation
  const simulation = d3
    .forceSimulation<PositionedPerson, PositionedLink>(peopleCopy)
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((d) => ((d as PositionedPerson).isRoot ? 200 : 50)),
    )
    .force(
      "center",
      d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    )
    .force(
      "charge",
      d3
        .forceRadial(250, windowSize.windowCenterX, windowSize.windowCenterY)
        .strength(0.1),
    )
    .force(
      "link",
      d3
        .forceLink<PositionedPerson, PositionedLink>(unpositionedLinks)
        .id((d) => d.id)
        .distance((d) =>
          (d as PositionedLink).relationship_type === "spouse" ? 1 : 50,
        ),
    );

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return { nodes: peopleCopy, links: unpositionedLinks as FinalizedLink[] };
}
