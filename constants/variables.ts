import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";

import { WindowSize } from "@/hooks/useWindowSize";

import { TAB_BAR_HEIGHT } from "./styles";

export const ROOT_NODE_RADIUS = 50;
export const REG_NODE_RADIUS = 25;
export const NODE_BORDER_WIDTH = 1;
export const TEST_NODE_DIM = 20;
export const ROOT_TEXT_SIZE = 14;
export const REG_TEXT_SIZE = 8;

const TEST_NODE_RADIUS = TEST_NODE_DIM / 2;

// Position is relative to absolutely positioned canvasWrapper
export function centerNode(
  windowSize: WindowSize,
  type: "root" | "non-root",
  from: "d3" | "other",
  scaleFactor: SharedValue<number>,
) {
  // NOTE: Positions calculated by d3 will already be referring to the center of the object. Items NOT calculated by d3 will need to have their radius' subtracted
  const adjustedHeight = windowSize.height;

  if (type === "root" && from === "d3") {
    return {
      nodeCenterX: windowSize.width / 2,
      nodeCenterY: adjustedHeight / 2,
    };
  } else if (type === "non-root" && from === "d3") {
    return {
      nodeCenterX: windowSize.width / 2,
      nodeCenterY: adjustedHeight / 2,
    };
  } else if (type === "root" && from === "other") {
    return {
      nodeCenterX: windowSize.width / 2 - TEST_NODE_RADIUS,
      nodeCenterY: adjustedHeight / 2 - TEST_NODE_RADIUS,
    };
  } else {
    return {
      nodeCenterX: windowSize.width / 2 - TEST_NODE_RADIUS,
      nodeCenterY: adjustedHeight / 2 - TEST_NODE_RADIUS,
    };
  }
}

// !TODO: 0.4 NEEDS TO BE REPLACED BY DYNAMIC SCALE FACTOR
