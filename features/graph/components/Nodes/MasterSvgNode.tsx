import {
  BlurMask,
  Circle,
  Group,
  RadialGradient,
  Text,
  matchFont,
  vec,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  GROUP_NODE_RADIUS,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { UiNode } from "@/lib/types/graph";
import { getColors } from "@/lib/utils/getColors";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface NodeProps {
  node: UiNode;
}

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 10,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function MasterSvgNode({ node }: NodeProps) {
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );

  const nodeStatus = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[node.id].node_status,
  );
  const isFocusedNode = useAppSelector(
    (state: RootState) => state.graphData.nodes.focusedNodeId === node.id,
  );

  const isRoot = node.depth === 1;
  const isGroup = node.type === "group" || node.type === "root_group";
  const radius = isRoot
    ? ROOT_NODE_RADIUS
    : isGroup
    ? GROUP_NODE_RADIUS
    : REG_NODE_RADIUS;
  const blurVal = isRoot ? radius / 3 : isGroup ? radius : radius / 1.5;

  // REVIEW: trans && transform
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

  const blurIntensity = useDerivedValue(() => {
    return withTiming(isFocusedNode ? blurVal : 0.1, { duration: 150 });
  });

  // const sunOpacity = useDerivedValue(() => {
  //   return withTiming(isFocusedNode ? 0.3 : 0.05, {
  //     duration: 150,
  //   });
  // });

  const shade = getColors(node);

  const color = useDerivedValue(() => {
    const c = shade[nodeStatus ? "active" : "inactive"];
    return withTiming(c, { duration: 150 });
  });

  // Calculate midpoint angle for label
  const midAngle = (node.startAngle + node.endAngle) / 2;

  const textMeasurements = node.name && font.measureText(node.name);

  const textWidth = textMeasurements && textMeasurements.width;
  const textHeight = textMeasurements && textMeasurements.height;

  // Calculate position of label
  const labelRadius = radius * 2;
  const rawLabelX = labelRadius * Math.cos(midAngle);
  const rawLabelY = labelRadius * Math.sin(midAngle);

  // Adjust label position based on text size
  // const adjustedLabelX = typeof textWidth === "number" && 0 - textWidth / 2 + 1;
  // const adjustedLabelY = typeof textHeight === "number" && 0 + textHeight / 4;
  const adjustedLabelX = typeof textWidth === "number" && 0 - textWidth / 2 + 1;
  const adjustedLabelY = typeof textHeight === "number" && 0 - textHeight / 2;

  // OPTIMIZE: You're rendering 2 nodes per every node just to handle the blur around the node. There must be a better way
  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      {/* Glow Layer */}
      <Circle r={radius} color={color}>
        <BlurMask style={"solid"} blur={blurIntensity} />
      </Circle>

      {/* Main node */}
      <Circle r={radius} color={color} />
      {/* <Circle opacity={sunOpacity} blendMode={"colorDodge"} r={radius}>
        <RadialGradient
          c={vec(0, 0)}
          r={radius}
          colors={["gold", "dark gold"]}
        />
      </Circle> */}
      <Text
        x={adjustedLabelX || 0}
        y={adjustedLabelY || 0}
        text={node.depth === 1 ? " ME" : node.name}
        font={font}
        color={node.depth === 1 ? "white" : color}
        // opacity={animatedTextOpacity}
      />
    </Group>
  );
}
