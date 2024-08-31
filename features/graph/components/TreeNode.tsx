import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Node, TREE_NODE_DIM } from "@/lib/utils/newTreeGraphStrategy";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface Props {
  node: d3.HierarchyPointNode<Node>;
}

// !TODO: PROPS MAY NOT BE EQUAL BECAUSE YOU'RE PASSING A FUNCTION

export default function TreeNode({ node }: Props) {
  // const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const position = useSharedValue({
    x: node.x,
    y: 0,
  });

  useEffect(() => {
    // Animate to the final position
    position.value = withTiming(
      {
        x: node.x,
        y: node.y,
      },
      { duration: 500 },
    );
  }, [node.x, node.y, position]);

  const tap = Gesture.Tap()
    .onStart(() => {
      console.log(node.data.name);
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // !TODO: ROTATE MUST BE FIRST
        { rotate: `${(position.value.x * 180) / Math.PI - 90}deg` },
        { translateY: position.value.y },
        // { translateX: position.value.x },
      ],
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.node,
          { backgroundColor: node.depth === 0 ? "green" : "#400601" },
          animatedStyle,
        ]}
      >
        <Animated.Text
          style={[
            {
              ...styles.text,
              transform: [
                { rotate: `-${(position.value.x * 180) / Math.PI - 90}deg` },
              ],
            },
          ]}
        >
          {node.data.name}
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  node: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#400601",
    width: TREE_NODE_DIM,
    height: TREE_NODE_DIM,
    borderRadius: 100,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent",
    color: "white",
  },
});
