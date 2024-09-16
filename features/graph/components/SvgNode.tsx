import { Circle, Group, matchFont, Text } from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getNodeStyles } from "@/lib/constants/Colors";
import { REG_NODE_RADIUS, ROOT_NODE_RADIUS } from "@/lib/constants/styles";
import { UiNode } from "@/lib/types/graph";
import { getFontSize } from "@/lib/utils/getFontSize";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { selectNodeStatus } from "../redux/graphSlice";

interface NodeSvgProps {
  node: UiNode;
}

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 10,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function SvgNode({ node }: NodeSvgProps) {
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );
  const nodeStatus = useAppSelector((state: RootState) => {
    if (node.depth === 1) {
      return state.graphData.nodes.byId[node.id].node_status;
    } else if (node.node_status === "active") {
      return node.node_status;
    } else {
      return selectNodeStatus(state, node.id);
    }
  });
  const radius = node.depth === 1 ? ROOT_NODE_RADIUS : REG_NODE_RADIUS;

  const { fillColor, borderColor, textColor, textOpacity } = getNodeStyles(
    nodeStatus,
    node.group_name !== null ? node.group_name : "Fallback",
    node.depth === 1,
  );

  const { xOffset, yOffset } = getFontSize(node.name, font);

  // handle initial positioning **********************************************
  const trans = useSharedValue({
    rotate: 0,
    x: centerX,
    y: centerY,
  });

  const transform = useDerivedValue(() => {
    return [
      { rotate: trans.value.rotate },
      { translateX: node.x },
      { translateY: node.y },
    ];
  });
  const animatedTextOpacity = useDerivedValue(() => {
    return withTiming(textOpacity, { duration: 200 });
  });

  const animatedFillColor = useDerivedValue(() => {
    return withTiming(fillColor, { duration: 300 });
  });

  const animatedBorderColor = useDerivedValue(() => {
    return withTiming(borderColor, {
      duration: 300,
    });
  });

  if (!node) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle color={animatedFillColor} r={radius}>
        {/* <Paint color={animatedFillColor} /> */}
        {/* <Paint
          color={animatedBorderColor}
          style="stroke"
          strokeWidth={NODE_BORDER_WIDTH}
          blendMode="darken"
          /> */}
      </Circle>
      <Circle r={radius - 2} color={animatedBorderColor}></Circle>
      <Text
        x={node.depth === 1 ? xOffset : radius + 3}
        y={yOffset}
        text={node.name}
        font={font}
        color={textColor}
        opacity={animatedTextOpacity}
      />
    </Group>
  );
}
