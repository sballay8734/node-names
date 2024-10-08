import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  GROUP_NODE_RADIUS,
  PRESSABLE_OPACITY,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { useGestureContext } from "@/lib/hooks/useGestureContext";
import { UiNode } from "@/lib/types/graph";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { toggleNode } from "../../redux/graphSlice";

interface PressableNodeProps {
  id: number;
  length: number;
}

export default function MasterPressableNode({
  id,
  length,
}: PressableNodeProps) {
  const dispatch = useAppDispatch();
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[id],
  );

  const { centerOnRootGroup } = useGestureContext();
  const isRoot = node.depth === 1;
  const isGroup = node.type === "group";
  const isRootGroup = node.type === "root_group";

  const dimensions = isRoot
    ? ROOT_NODE_RADIUS * 2
    : isGroup
    ? GROUP_NODE_RADIUS * 4
    : isRootGroup
    ? GROUP_NODE_RADIUS * 32
    : REG_NODE_RADIUS * 2;

  const tap = Gesture.Tap()
    .onStart(() => {})
    .onEnd(() => {
      if (node.type === "root_group") {
        // console.log(
        //   node.startAngle * (180 / Math.PI),
        //   node.endAngle * (180 / Math.PI),
        // );
        const centerAngle = node.startAngle - node.endAngle;
        const finalAngle = node.startAngle - (node.startAngle - centerAngle);
        // centerOnRootGroup(node.x, node.y, finalAngle);
      }
      dispatch(toggleNode(node.id));
    })
    .runOnJS(true);

  const position = useDerivedValue(() => {
    const angle = Math.atan2(node.currentY - centerY, node.currentX - centerX);
    const nudgeDistance = 40;

    let nudgeX = 0;
    let nudgeY = 0;

    if (isRootGroup) {
      nudgeX = Math.cos(angle) * nudgeDistance;
      nudgeY = Math.sin(angle) * nudgeDistance;
    }

    const nodeRadius = isRoot
      ? ROOT_NODE_RADIUS
      : isGroup
      ? GROUP_NODE_RADIUS
      : isRootGroup
      ? GROUP_NODE_RADIUS * 16
      : REG_NODE_RADIUS;

    return {
      x: node.currentX - nodeRadius + nudgeX,
      y: node.currentY - nodeRadius + nudgeY,
    };
  });

  const transformStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y },
      ],
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.wrapper,
          {
            height: dimensions,
            width: dimensions,
            // backgroundColor: node.depth === 1 ? depth1Bg : depth2Bg,
            backgroundColor: "red",
          },
          { ...transformStyles },
        ]}
      >
        {/* <Animated.Text>{node.name}</Animated.Text> */}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    opacity: PRESSABLE_OPACITY,
  },
});
