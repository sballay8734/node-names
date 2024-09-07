import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useDerivedValue } from "react-native-reanimated";

import { GROUP_NODE_RADIUS, PRESSABLE_OPACITY } from "@/lib/constants/styles";
import { UiNode } from "@/lib/types/graph";
import { useAppDispatch } from "@/store/reduxHooks";

import { toggleNode } from "../redux/graphSlice";

interface PressableGroupNodeProps {
  node: UiNode;
}

export default function PressableGroupNode({ node }: PressableGroupNodeProps) {
  const dispatch = useAppDispatch();

  const dimensions = GROUP_NODE_RADIUS * 2;

  const tap = Gesture.Tap()
    .onStart(() => {
      // console.log("TAPPED", node.name);
    })
    .onEnd(() => {
      dispatch(toggleNode(node.id));
    })
    .runOnJS(true);

  const position = useDerivedValue(() => {
    return {
      x: node.x - GROUP_NODE_RADIUS,
      y: node.y - GROUP_NODE_RADIUS,
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
