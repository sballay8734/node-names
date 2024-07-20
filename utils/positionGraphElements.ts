import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import { WindowSize } from "@/hooks/useWindowSize";
import { Tables } from "@/types/dbTypes";

export interface PositionedPersonNode extends Tables<"people"> {
  nodeX: number;
  nodeY: number;
}

// render nodes
export function positionNodes(
  people: Tables<"people">[],
  windowSize: WindowSize,
): PositionedPersonNode[] {
  const totalNodes = people.length - 1;

  const formattedNodes = people.map((person, index) => {
    if (person.isRoot) {
      return {
        nodeX: windowSize.windowCenterX,
        nodeY: windowSize.windowCenterY,
        ...person,
      };
    } else {
      // get yValue
      const yAngle = (index / totalNodes) * 2 * Math.PI;
      const yValue =
        Math.sin(yAngle) * ROOT_NODE_RADIUS + windowSize.windowCenterY;

      // get xValue
      const xAngle = (index / totalNodes) * 2 * Math.PI;
      const xValue =
        Math.cos(xAngle) * ROOT_NODE_RADIUS + windowSize.windowCenterX;

      return {
        nodeX: xValue,
        nodeY: yValue,
        ...person,
      };
    }
  });

  return formattedNodes;
}

// then render links
export function postionLinks(connections: Tables<"connections">[]) {}

// then do something here (start with links and nodes)
export function handleGrouping(groups: Tables<"groups">[]) {}

// HELPERS ********************************************************************
function getNodePosition(person: Tables<"people">, index: number) {}
