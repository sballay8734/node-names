import { ActionCreatorWithPayload, Dispatch } from "@reduxjs/toolkit";

import { TestNode } from "@/features/Graph/redux/graphSlice";

import { NGroup, NLink, NPerson } from "../data/new_structure";
import { WindowSize } from "../types/misc";

export interface PositionedGroup extends NGroup {
  x: number;
  y: number;
}

export interface PositionedPerson extends NPerson {
  x: number;
  y: number;
}

export interface PositionedLink extends NLink {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface NData {
  groups: NGroup[];
  people: NPerson[];
  links: NLink[];
}

interface PositionedData {
  groups: PositionedGroup[];
  people: PositionedPerson[];
  links: PositionedLink[];
}

export function createGraph(
  data: NData,
  windowSize: WindowSize,
  dispatch: Dispatch,
  setTestInitialState: ActionCreatorWithPayload<{ nodes: TestNode[] }>,
): {
  data: PositionedData;
  groupPositions: Map<number, { x: number; y: number }>;
} {
  const width = windowSize.width;
  const height = windowSize.height;
  const { groups, people, links } = data;

  // Calculate the center of the circle
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate the radius of the circle (use 90% of the smaller dimension)
  const radius = Math.min(width, height) * 0.4;

  // Create a map to store group positions
  const groupPositions = new Map<
    number,
    { x: number; y: number; angle: number }
  >();

  // Calculate positions for each group
  const positionedGroups = groups.map((group, index) => {
    // Add half of the angle step if there's an even number of groups
    const angleOffset = groups.length % 2 === 0 ? Math.PI / groups.length : 0;
    const angle =
      (index / groups.length) * 2 * Math.PI - Math.PI / 2 + angleOffset;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    groupPositions.set(group.id, { x, y, angle });
    return { ...group, x, y, angle };
  });

  // Function to get a person's position based on their group
  const getPersonPosition = (person: NPerson): { x: number; y: number } => {
    if (person.group_id === null) {
      return { x: centerX, y: centerY }; // Place ungrouped people in the center
    }
    const groupPos = groupPositions.get(person.group_id);
    if (!groupPos) {
      console.warn(`No position found for group ${person.group_id}`);
      return { x: centerX, y: centerY };
    }
    // Position people radially outward from the group's position
    // REMOVE: shouldn't be a hardcoded value here
    const distanceFromGroup = 100;
    return {
      x: groupPos.x + distanceFromGroup * Math.cos(groupPos.angle),
      y: groupPos.y + distanceFromGroup * Math.sin(groupPos.angle),
    };
  };

  // Calculate positions for each person
  const positionedPeople = people.map((person) => ({
    ...person,
    ...getPersonPosition(person),
  }));

  // Calculate positions for links
  const positionedLinks = links.map((link) => {
    const source = positionedPeople.find((p) => p.id === link.source_id);
    const target = positionedPeople.find((p) => p.id === link.target_id);
    return {
      ...link,
      x1: source?.x ?? centerX,
      y1: source?.y ?? centerY,
      x2: target?.x ?? centerX,
      y2: target?.y ?? centerY,
    };
  });

  dispatch(setTestInitialState({ nodes: positionedPeople }));

  return {
    data: {
      groups: positionedGroups,
      people: positionedPeople,
      links: positionedLinks,
    },
    groupPositions,
  };
}
