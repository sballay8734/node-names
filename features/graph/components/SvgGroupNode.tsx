import {
  Blend,
  Circle,
  Group,
  matchFont,
  Paint,
  RadialGradient,
  Text,
  vec,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getNodeStyles, GRAPH_BG_COLOR } from "@/lib/constants/Colors";
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

  const animatedTextOpacity = useDerivedValue(() => {
    return withTiming(textOpacity, { duration: 200 });
  });

  const animatedFillColor = useDerivedValue(() => {
    return withTiming(fillColor, { duration: 300 });
  });

  const animatedBorderColor = useDerivedValue(() => {
    return withTiming(borderColor, { duration: 300 });
  });

  if (!node) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle r={radius}>
        <Paint color={animatedFillColor} />
        <Paint
          color={animatedBorderColor}
          style="stroke"
          strokeWidth={NODE_BORDER_WIDTH}
        />
        {/* <Blend mode="srcOut">
          <RadialGradient
            r={radius}
            c={vec(0, 0)}
            colors={[fillColor, GRAPH_BG_COLOR]}
          />
        </Blend> */}
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
