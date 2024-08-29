import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";

import { WindowSize } from "@/lib/types/misc";

import { TEST_NODE_RADIUS } from "../constants/styles";

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
