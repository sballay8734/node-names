import { useContext } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useDerivedValue } from "react-native-reanimated";

import {
  GROUP_NODE_RADIUS,
  PRESSABLE_OPACITY,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { useGestureContext } from "@/lib/hooks/useGestureContext";
import { UiNode } from "@/lib/types/graph";
import { useAppDispatch } from "@/store/reduxHooks";

import { newToggleNode } from "../../redux/graphSlice";

interface PressableNodeProps {
  node: UiNode;
}

export default function MasterPressableNode({ node }: PressableNodeProps) {
  const dispatch = useAppDispatch();
  const { centerOnRootGroup } = useGestureContext();
  const isRoot = node.depth === 1;
  const isGroup = node.type === "group";
  const isRootGroup = node.type === "root_group";

  const dimensions = isRoot
    ? ROOT_NODE_RADIUS * 2
    : isGroup
    ? GROUP_NODE_RADIUS * 4
    : isRootGroup
    ? GROUP_NODE_RADIUS * 12
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
      dispatch(newToggleNode(node.id));
    })
    .runOnJS(true);

  const position = useDerivedValue(() => {
    return {
      x: isRoot
        ? node.x - ROOT_NODE_RADIUS
        : isGroup
        ? node.x - GROUP_NODE_RADIUS
        : isRootGroup
        ? node.x - GROUP_NODE_RADIUS * 6
        : node.x - REG_NODE_RADIUS,
      y: isRoot
        ? node.y - ROOT_NODE_RADIUS
        : isGroup
        ? node.y - GROUP_NODE_RADIUS
        : isRootGroup
        ? node.y - GROUP_NODE_RADIUS * 6
        : node.y - REG_NODE_RADIUS,
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.wrapper,
          {
            transform: [
              { translateX: position.value.x },
              { translateY: position.value.y },
            ],
            height: dimensions,
            width: dimensions,
            // backgroundColor: node.depth === 1 ? depth1Bg : depth2Bg,
            backgroundColor: "red",
          },
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
