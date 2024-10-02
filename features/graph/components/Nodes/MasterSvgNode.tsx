import {
  BlurMask,
  Circle,
  Group,
  Rect,
  Text,
  matchFont,
} from "@shopify/react-native-skia";
import {
  Extrapolation,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  GROUP_NODE_RADIUS,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { GestureContextType } from "@/lib/context/gestures";
import { UiNode } from "@/lib/types/graph";
import { getColors } from "@/lib/utils/getColors";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface NodeProps {
  node: UiNode;
  gestures: GestureContextType;
}

// !TODO: YOU MUST CREATE BUILD TO USE FONTS

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 24,
  // fontStyle: "normal",
  // fontWeight: "400",
});

// console.log(font.getMetrics());

// 0.3 is really zoomed OUT
// 4 is really zoomed IN

export default function MasterSvgNode({ node, gestures }: NodeProps) {
  // const labelOpacity = useDerivedValue(() => {
  //   let inputRange, outputRange;

  //   switch (node.type) {
  //     case "root":
  //       inputRange = [4, 2.2, 1.8];
  //       outputRange = [0, 0.5, 0.5];
  //       break;
  //     case "root_group":
  //       inputRange = [1, 3];
  //       outputRange = [1, 0];
  //       break;
  //     case "node":
  //       inputRange = [1.8, 2];
  //       outputRange = [0, 1];
  //       break;
  //     default:
  //       inputRange = [0.3, 4];
  //       outputRange = [0, 1];
  //   }

  //   return interpolate(
  //     gestures.scale.value,
  //     inputRange,
  //     outputRange,
  //     Extrapolation.CLAMP,
  //   );
  // });

  const rootGroupActive = useAppSelector(
    (state: RootState) =>
      node.group_id && state.graphData.nodes.byId[node.group_id].node_status,
  );
  const nodeStatusTrue = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[node.id].node_status,
  );

  const labelOpacity = useDerivedValue(() => {
    return withTiming(rootGroupActive ? 1 : 0, { duration: 200 });
  });

  // const textScale = useDerivedValue(() => {
  //   if (node.type === "root") {
  //     return interpolate(gestures.scale.value, [0.3, 4], [2, 1]);
  //   } else if (node.type === "node") {
  //     return interpolate(gestures.scale.value, [0.3, 4], [1, 0.5]);
  //   } else if (node.type === "root_group") {
  //     return interpolate(
  //       gestures.scale.value,
  //       [0.3, 0.4, 1, 2.5],
  //       [0, 2, 1.5, 0.9],
  //     );
  //   }
  //   {
  //     return 1;
  //   }
  // });

  // const textTransform = useDerivedValue(() => {
  //   return [{ scale: textScale.value }];
  // });

  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );

  const isRoot = node.depth === 1;
  const isGroup = node.type === "group" || node.type === "root_group";
  const radius = isRoot
    ? ROOT_NODE_RADIUS
    : isGroup
    ? GROUP_NODE_RADIUS
    : REG_NODE_RADIUS / 2;
  const blurVal = isRoot ? radius / 3 : isGroup ? radius : radius / 1.5;

  const transform = useDerivedValue(() => {
    return [
      { rotate: gestures.rotate.value },
      { translateX: node.x },
      { translateY: node.y },
    ];
  });

  // const blurIntensity = useDerivedValue(() => {
  //   return withTiming(isFocusedNode ? blurVal : 0.1, { duration: 150 });
  // });

  const shade = getColors(node);

  const color = useDerivedValue(() => {
    const c =
      shade[
        node.type === "root" ? "active" : nodeStatusTrue ? "active" : "inactive"
      ];
    return withTiming(c, { duration: 150 });
  });

  function getLabelPosition(text: string, node: UiNode) {
    const textDim = font.measureText(text);
    const textWidth = textDim.width;
    const textHeight = textDim.height;
    const metrics = font.getMetrics();
    const textX = textDim.x;
    const textY = textDim.y;

    // Calculate angle between center of screen and node
    const angle = Math.atan2(node.y - centerY, node.x - centerX);

    // LOOKS GOOD (I think these center it on the node)
    let labelX = -(textWidth + textX) / 2;
    let labelY = textHeight / 2;

    // **********************************************************************
    const horizontalPush = textWidth * Math.cos(angle);
    const verticalPush = textHeight * Math.sin(angle);

    const offsetX = radius + Math.abs(horizontalPush / 2) + 45;
    const offsetY = radius + Math.abs(verticalPush / 2) + 45;

    labelX += Math.cos(angle) * offsetX;
    labelY += Math.sin(angle) * offsetY;
    // **********************************************************************

    return { labelX, labelY, textHeight, textWidth };
  }

  // console.log(node.name, getLabelPosition(node.name, node));

  const opacity = useDerivedValue(() => {
    return withTiming(rootGroupActive || node.type === "root" ? 1 : 0.2, {
      duration: 200,
    });
  });

  const { labelX, labelY, textHeight, textWidth } = getLabelPosition(
    node.name,
    node,
  );

  // OPTIMIZE: You're rendering 2 nodes per every node just to handle the blur around the node. There must be a better way
  return (
    <Group
      origin={{ x: centerX, y: centerY }}
      transform={transform}
      opacity={opacity}
    >
      {/* Glow Layer */}
      {/* <Circle r={radius} color={color}>
        <BlurMask style={"solid"} blur={blurIntensity} />
      </Circle> */}
      {/* Main node */}
      <Circle r={radius} color={color} />
      <Rect
        x={labelX}
        y={labelY}
        width={textWidth}
        height={-textHeight}
        color="rgba(0, 0, 0, 0.2)" // Semi-transparent box for visibility
      />
      <Text
        x={labelX}
        y={labelY}
        text={node.depth === 1 ? "3D" : node.name}
        // text={""}
        font={font}
        color={node.depth === 1 ? "white" : color}
        opacity={labelOpacity}
        style={"stroke"}
        // transform={textTransform}
      />
    </Group>
  );
}
