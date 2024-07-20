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
export interface PositionedLink
  extends d3.SimulationLinkDatum<PositionedPerson> {
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
  // Create a copy of people
  const peopleCopy: PositionedPerson[] = people.map((p) => ({ ...p }));

  // Find the root node and set its fixed position
  const rootNode = peopleCopy.find((p) => p.isRoot === true);
  if (rootNode) {
    (rootNode as PositionedPerson).fx = windowSize.windowCenterX;
    (rootNode as PositionedPerson).fy = windowSize.windowCenterY;
  }

  // Create the links array that D3 force layout expects
  const links: PositionedLink[] = connections.map((connection) => ({
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
        .forceLink<PositionedPerson, PositionedLink>(links)
        .id((d) => d.id)
        .distance((d) =>
          (d as PositionedLink).relationship_type === "spouse" ? 1 : 50,
        ),
    );

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return { nodes: peopleCopy, links };
}

type testLink = {
  created_at: "2024-07-20T14:09:26.741696+00:00";
  id: 1;
  index: 0;
  person_1_id: 1;
  person_2_id: 2;
  relationship_type: "friend";
  source: {
    created_at: "2024-07-20T14:07:07.332245+00:00";
    first_name: "Shawn";
    fx: 196.5;
    fy: 386.5;
    group_id: null;
    id: 1;
    index: 14;
    isRoot: true;
    last_name: "Ballay";
    maiden_name: null;
    phonetic_name: "sh AW n";
    sex: "male";
    vx: 0;
    vy: 0;
    x: 196.5;
    y: 386.5;
  };
  target: {
    created_at: "2024-07-20T14:08:06.754277+00:00";
    first_name: "Aaron";
    group_id: 2;
    id: 2;
    index: 1;
    isRoot: null;
    last_name: "Mackenzie";
    maiden_name: null;
    phonetic_name: "Ah run";
    sex: "male";
    vx: -0.16876997911939293;
    vy: -0.03978025248545495;
    x: -53.00254589916284;
    y: 392.1242752158686;
  };
};
