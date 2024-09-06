import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { store } from "@/store/store";

import {
  PositionedGroup,
  PositionedLink,
  PositionedNode,
  RawGroup,
  RawLink,
  RawNode,
} from "../types/graph";
import { WindowSize } from "../types/misc";

export function positionGraphEls(
  data: { groups: RawGroup[]; people: RawNode[]; links: RawLink[] },
  windowSize: WindowSize,
): {
  data: {
    groups: PositionedGroup[];
    nodes: PositionedNode[];
    links: PositionedLink[];
  };
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
  const groupPositions = new Map<number, PositionedGroup>();

  // Calculate positions for each group
  const positionedGroups: PositionedGroup[] = groups.map((group, index) => {
    // Add half of the angle step if there's an even number of groups
    const angleOffset = groups.length % 2 === 0 ? Math.PI / groups.length : 0;
    const angle =
      (index / groups.length) * 2 * Math.PI - Math.PI / 2 + angleOffset;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    groupPositions.set(group.id, {
      id: group.id,
      group_name: group.group_name,
      x,
      y,
      angle,
    });

    return { ...group, x, y, angle };
  });

  // Function to get a person's position based on their group
  const getPersonPosition = (person: RawNode): { x: number; y: number } => {
    if (person.group_id === null) {
      return { x: centerX, y: centerY }; // Place uRawGrouped people in the center
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
  const positionedNodes: PositionedNode[] = people.map((person) => ({
    ...person,
    ...getPersonPosition(person),
  }));

  // Calculate positions for links
  const positionedLinks: PositionedLink[] = links.map((link) => {
    const source = positionedNodes.find((p) => p.id === link.source_id);
    const target = positionedNodes.find((p) => p.id === link.target_id);
    return {
      ...link,
      x1: source?.x ?? centerX,
      y1: source?.y ?? centerY,
      x2: target?.x ?? centerX,
      y2: target?.y ?? centerY,
    };
  });

  store.dispatch(
    setInitialState({
      nodes: positionedNodes,
      links: positionedLinks,
      groups: positionedGroups,
    }),
  );

  return {
    data: {
      groups: positionedGroups,
      nodes: positionedNodes,
      links: positionedLinks,
    },
    groupPositions,
  };
}
