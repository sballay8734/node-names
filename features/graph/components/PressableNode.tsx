import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useDerivedValue } from "react-native-reanimated";

import { REG_NODE_RADIUS, ROOT_NODE_RADIUS } from "@/lib/constants/styles";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface PressableNodeProps {
  node_id: number;
}

export default function PressableNode({ node_id }: PressableNodeProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[node_id],
  );
  const dimensions =
    node.depth === 1 ? ROOT_NODE_RADIUS * 2 : REG_NODE_RADIUS * 2;

  const tap = Gesture.Tap()
    .onStart(() => {
      console.log("TAPPED", node.name);
    })
    .runOnJS(true);

  const position = useDerivedValue(() => {
    return {
      x:
        node.depth === 1 ? node.x - ROOT_NODE_RADIUS : node.x - REG_NODE_RADIUS,
      y:
        node.depth === 1 ? node.y - ROOT_NODE_RADIUS : node.y - REG_NODE_RADIUS,
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
            backgroundColor: node.depth === 1 ? "red" : "blue",
          },
        ]}
      >
        <Animated.Text>{node.name}</Animated.Text>
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
    // opacity: 0,
  },
});
