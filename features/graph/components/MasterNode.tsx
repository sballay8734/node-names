import {
  BlurMask,
  Circle,
  Group,
  Text,
  matchFont,
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
    return withTiming(isFocusedNode ? blurVal : 0.1, { duration: 200 });
  });

  const sunOpacity = useDerivedValue(() => {
    return withTiming(nodeStatus !== "active" ? 1 : 0.3, {
      duration: 200,
    });
  });

  const shade = getColors(node);

  const color = useDerivedValue(() => {
    const c = shade[nodeStatus];
    return c;
  });

  if (node.type === "group") {
    console.log("RENDERING...", node.name);
  }

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
      {/* <Text
        // x={node.depth === 1 ? xOffset : radius + 3}
        // y={yOffset}
        text={node.name}
        font={font}
        color={"white"}
        // opacity={animatedTextOpacity}
      /> */}
    </Group>
  );
}
