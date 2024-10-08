import { Circle, Group, Text, matchFont } from "@shopify/react-native-skia";
import { useEffect } from "react";
import {
  useAnimatedReaction,
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
import { getColors, groupMap } from "@/lib/utils/getColors";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface NodeProps {
  id: number;
  gestures: GestureContextType;
  newestX: number;
  newestY: number;
  totalIds: number;
}

// !TODO: YOU MUST CREATE BUILD TO USE FONTS

export default function MasterSvgNode({
  id,
  gestures,
  newestX,
  newestY,
  totalIds,
}: NodeProps) {
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

  console.log(totalIds);

  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[id],
  );

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

  const dispatch = useAppDispatch();

  const font = matchFont({
    fontFamily: "Helvetica",
    fontSize: node.type === "root_group" ? 22 : 10,
    // fontStyle: "normal",
    // fontWeight: "400",
  });
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );

  useEffect(() => {}, [node.x, node.y]);

  const nodeX = useSharedValue(node.x);
  const nodeY = useSharedValue(node.y);

  const textPosition = useDerivedValue(() => {
    const x = nodeX.value;
    const y = nodeY.value;

    if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
      return { labelX: 0, labelY: 0 };
    }
    function calculateLabelPosition(
      text: string,
      isRootGroup: boolean,
    ): { labelX: number; labelY: number } {
      "worklet";
      const textDim = font.measureText(text);
      const textWidth = textDim.width;
      const textHeight = textDim.height;
      const textX = textDim.x;
      const textY = textDim.y;

      const radius = isRoot
        ? ROOT_NODE_RADIUS
        : isGroup
        ? GROUP_NODE_RADIUS
        : REG_NODE_RADIUS / 2;

      const angle = Math.atan2(nodeY.value - centerY, nodeX.value - centerX);

      let labelX: number = -(textWidth + textX) / 2;
      let labelY: number = textHeight / 2;

      const horizontalPush = textWidth * Math.cos(angle);
      const verticalPush = textHeight * Math.sin(angle);

      const offsetX = radius + Math.abs(horizontalPush / 2) + 45;
      const offsetY = radius + Math.abs(verticalPush / 2) + 45;

      labelX += Math.cos(angle) * offsetX;
      labelY += Math.sin(angle) * offsetY;

      return { labelX, labelY };
    }

    return calculateLabelPosition(node.name, node.type === "root_group");
  });

  useAnimatedReaction(
    () => ({ x: node.x, y: node.y }),
    (current, previous) => {
      if (current && previous) {
        if (current.x !== previous.x) {
          nodeX.value = withTiming(current.x, { duration: 300 });
        }
        if (current.y !== previous.y) {
          nodeY.value = withTiming(current.y, { duration: 300 });
        }
      }
    },
  );

  // !TODO: NEW NODEs POSITION IS NOT UPDATING QUICKLY ENOUGH? IT COMES IN AT (0,0). ADDING A COMMENT AND SAVING PUTS THE NODES IN THE CORRECT SPOT

  useEffect(() => {
    console.log("Node coordinates:", node.name, node.x, node.y);
  }, [node.name, node.x, node.y]);

  useEffect(() => {
    console.log("Shared value nodeX:", nodeX.value);
    console.log("Shared value nodeY:", nodeY.value);
  }, [nodeX.value, nodeY.value]);

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
      { translateX: nodeX.value },
      { translateY: nodeY.value },
    ];
  });

  // const blurIntensity = useDerivedValue(() => {
  //   return withTiming(isFocusedNode ? blurVal : 0.1, { duration: 150 });
  // });

  const shade = getColors(node);

  const color = useDerivedValue(() => {
    const c = shade
      ? shade[
          node.type === "root"
            ? "active"
            : nodeStatusTrue
            ? "active"
            : "inactive"
        ]
      : groupMap["Fallback"].active;
    return withTiming(c, { duration: 150 });
  });

  const opacity = useDerivedValue(() => {
    return withTiming(rootGroupActive || node.type === "root" ? 1 : 0.2, {
      duration: 200,
    });
  });

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
      {/* <Rect
        x={labelX}
        y={labelY}
        width={textWidth}
        height={-textHeight}
        color="rgba(255, 0, 0, 0.2)" // Semi-transparent box for visibility
      /> */}
      <Text
        x={textPosition.value.labelX}
        y={textPosition.value.labelY}
        text={node.depth === 1 ? "3D" : `${node.name}`}
        font={font}
        color={node.depth === 1 ? "white" : color}
        opacity={labelOpacity}
        style={"fill"}
        // transform={transform}
      />
    </Group>
  );
}
