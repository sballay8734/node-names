import {
  BlurMask,
  Circle,
  Group,
  matchFont,
  RadialGradient,
  Shadow,
  Text,
  vec,
} from "@shopify/react-native-skia";
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
  const isFocusedNode = useAppSelector(
    (state: RootState) => state.graphData.nodes.focusedNodeId === node.id,
  );

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
    return withTiming(fillColor, { duration: 200 });
  });

  const blurIntensity = useDerivedValue(() => {
    return isFocusedNode
      ? withTiming(radius, { duration: 200 })
      : withTiming(0, { duration: 200 });
  });

  const sunOpacity = useDerivedValue(() => {
    return node.node_status !== "active"
      ? withTiming(1, { duration: 200 })
      : withTiming(0.3, { duration: 200 });
  });
  const nodeOpacity = useDerivedValue(() => {
    return node.node_status === "active"
      ? withTiming(1, { duration: 200 })
      : withTiming(0.3, { duration: 200 });
  });

  if (!node) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle opacity={nodeOpacity} color={animatedFillColor} r={radius}>
        <BlurMask style={"solid"} blur={blurIntensity} />
      </Circle>
      <Circle opacity={sunOpacity} blendMode={"colorDodge"} r={radius}>
        <RadialGradient
          c={vec(0, 0)}
          r={radius}
          colors={["gold", "dark gold"]}
        />
      </Circle>
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
