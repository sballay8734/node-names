import {
  BlurMask,
  Circle,
  Group,
  RadialGradient,
  vec,
  Text,
  matchFont,
} from "@shopify/react-native-skia";
import {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import {
  GROUP_NODE_RADIUS,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { UiNode } from "@/lib/types/graph";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
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

export default function MasterNode({ node }: NodeProps) {
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );

  const dispatch = useAppDispatch();
  const nodeStatus = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[node.id].node_status,
  );
  const isFocusedNode = useAppSelector(
    (state: RootState) => state.graphData.nodes.focusedNodeId === node.id,
  );

  const isRoot = node.depth === 1;
  const isGroup = node.type === "group";
  const radius = isRoot
    ? ROOT_NODE_RADIUS
    : isGroup
    ? GROUP_NODE_RADIUS
    : REG_NODE_RADIUS;

  const blurIntensity = useDerivedValue(() => {
    return withTiming(isFocusedNode ? radius : 0, { duration: 200 });
  });

  const sunOpacity = useDerivedValue(() => {
    return withTiming(node.node_status !== "active" ? 1 : 0.3, {
      duration: 200,
    });
  });

  return (
    // <Group origin={{ x: centerX, y: centerY }} transform={transform}>
    <Group origin={{ x: centerX, y: centerY }}>
      <Circle r={radius}>
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
        // x={node.depth === 1 ? xOffset : radius + 3}
        // y={yOffset}
        text={node.name}
        font={font}
        // color={textColor}
        // opacity={animatedTextOpacity}
      />
    </Group>
  );
}
