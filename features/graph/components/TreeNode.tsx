import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  Node,
  TREE_NODE_DIM,
  TREE_NODE_RADIUS,
} from "@/lib/utils/newTreeGraphStrategy";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";
import windowSize from "../redux/windowSize";
import { ROOT_NODE_RADIUS } from "@/lib/constants/styles";
import { useEffect } from "react";

interface Props {
  node: d3.HierarchyPointNode<Node>;
}

// !TODO: PROPS MAY NOT BE EQUAL BECAUSE YOU'RE PASSING A FUNCTION

export default function TreeNode({ node }: Props) {
  // const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const position = useSharedValue({
    x: windowSize.windowCenterX - TREE_NODE_RADIUS,
    y: windowSize.windowCenterY - TREE_NODE_RADIUS,
  });

  useEffect(() => {
    // Trigger the animation when the component mounts
    position.value = withTiming(
      {
        x: node.depth === 0 ? node.x : node.x - TREE_NODE_RADIUS,
        y:
          node.depth === 0
            ? node.y
            : node.y + windowSize.windowCenterY + TREE_NODE_RADIUS,
      },
      { duration: 500 }, // Adjust duration as needed
    );
  }, [node.x, node.y, position, node.depth]);

  const tap = Gesture.Tap()
    .onStart(() => {
      console.log(node);
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y },
      ],
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.node, animatedStyle]}>
        <Animated.Text style={[{ ...styles.text }]}>
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
    borderRadius: 30,
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

// const huh = {
//   data: {
//     children: [],
//     groupId: 3,
//     name: "Kevin Smith",
//     relationshipType: "parent_child",
//   },
//   depth: 3,
//   height: 0,
//   parent: {
//     children: [[Node], [Circular]],
//     data: {
//       children: [Array],
//       groupId: 3,
//       name: "Linda Smith",
//       relationshipType: "spouse",
//     },
//     depth: 2,
//     height: 1,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 2,
//       parent: [Node],
//       x: 5.140787978601479,
//       y: 55.5,
//     },
//     x: 5.140787978601479,
//     y: 111,
//   },
//   x: 5.426387310746007,
//   y: 166.5,
// };
