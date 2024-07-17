import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import { REG_NODE_RADIUS } from "@/constants/nodes";
import { WindowSize } from "@/hooks/useWindowSize";
import {
  Circle,
  Group,
  matchFont,
  Text as SkiaText,
} from "@shopify/react-native-skia";
import { Platform } from "react-native";
import { INode } from "./types/graphTypes";

interface Props {
  node: INode;
  index: number;
  totalNodes: number;
  windowSize: WindowSize;
}

export default function Node({
  node,
  index,
  totalNodes,
  windowSize,
}: Props): React.JSX.Element {
  // Font config ***************************************************************
  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });

  // TODO: Font size should be based on node width
  const fontStyle = {
    fontFamily,
    fontSize: 12,
  };
  const font = matchFont(fontStyle);

  // word circle around root node
  function getYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterY;
  }

  function getXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterX;
  }

  return (
    <Group>
      <Circle
        // color={"#8f97eb"}
        cx={getXValue(index)}
        cy={getYValue(index)}
        r={REG_NODE_RADIUS / 2}
      />
    </Group>
  );
}
