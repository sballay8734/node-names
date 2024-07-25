import { WindowSize } from "@/hooks/useWindowSize";

import { TAB_BAR_HEIGHT } from "./styles";

export const ROOT_NODE_RADIUS = 100;
export const REG_NODE_RADIUS = 50;
export const NODE_BORDER_WIDTH = 1;

export function centerNode(windowSize: WindowSize, type: "root" | "non-root") {
  if (type === "root") {
    return {
      nodeCenterX: windowSize.width / 2 - (ROOT_NODE_RADIUS / 2) * 0.4,
      nodeCenterY: windowSize.height / 2 - (ROOT_NODE_RADIUS / 2) * 0.4,
    };
  } else {
    return {
      nodeCenterX: windowSize.width / 2 - (REG_NODE_RADIUS / 2) * 0.4,
      nodeCenterY:
        (windowSize.height - TAB_BAR_HEIGHT) / 2 - (REG_NODE_RADIUS / 2) * 0.4,
    };
  }
}

// !TODO: 0.4 NEEDS TO BE REPLACED BY DYNAMIC SCALE FACTOR
