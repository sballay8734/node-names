import {
  BlurMask,
  Circle,
  Group,
  matchFont,
  Paint,
  Text,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getNodeStyles } from "@/lib/constants/Colors";
import {
  GROUP_NODE_RADIUS,
  NODE_BORDER_WIDTH,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { UiNode } from "@/lib/types/graph";
import { getFontSize } from "@/lib/utils/getFontSize";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { selectNodeStatus } from "../redux/graphSlice";

interface GroupNodeSvgProps {
  node: UiNode;
}

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 12,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function SvgGroupNode({ node }: GroupNodeSvgProps) {
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );
  const isFocusedNode = useAppSelector(
    (state: RootState) => state.graphData.nodes.focusedNodeId,
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

  const { fillColor, borderColor, textColor, textOpacity } = getNodeStyles(
    nodeStatus,
    node.group_name !== null ? node.group_name : "Fallback",
    node.depth === 1,
  );
  const radius = node.depth === 1 ? ROOT_NODE_RADIUS : GROUP_NODE_RADIUS;

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

  // !TODO: You probably have too many of these calls to useDerivedValue which is causing the flickering
  const animatedTextOpacity = useDerivedValue(() => {
    return withTiming(textOpacity, { duration: 200 });
  });

  const animatedFillColor = useDerivedValue(() => {
    return withTiming(fillColor, { duration: 200 });
  });

  const animatedBorderColor = useDerivedValue(() => {
    return withTiming(borderColor, { duration: 200 });
  });

  const blurIntensity = useDerivedValue(() => {
    return isFocusedNode
      ? withTiming(radius, { duration: 200 })
      : withTiming(0, { duration: 200 });
  });

  if (!node) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle color={animatedFillColor} r={radius}>
        <BlurMask style={"solid"} blur={blurIntensity} />
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
