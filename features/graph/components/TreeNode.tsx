import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Node } from "@/lib/utils/newTreeGraphStrategy";
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
    x: windowSize.windowCenterX,
    y: windowSize.windowCenterY,
  });

  useEffect(() => {
    // Trigger the animation when the component mounts
    position.value = withTiming(
      { x: node.x, y: node.y },
      { duration: 500 }, // Adjust duration as needed
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
    width: 60,
    height: 60,
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
