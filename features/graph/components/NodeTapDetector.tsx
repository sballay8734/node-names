import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  REG_NODE_RADIUS,
  REG_TEXT_SIZE,
  ROOT_NODE_RADIUS,
  ROOT_TEXT_SIZE,
} from "@/lib/constants/styles";
import { UiNode } from "@/lib/types/graph";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { getColors } from "../../../lib/utils/getColors";
import { toggleNode } from "../redux/graphSlice";

interface Props {
  nodeId: number;
  centerOnNode: (node: UiNode) => void;
}

// !TODO: PROPS MAY NOT BE EQUAL BECAUSE YOU'RE PASSING A FUNCTION

export default function NodeTapDetector({ nodeId, centerOnNode }: Props) {
  const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[nodeId],
  );

  // !TODO: Need a better way to manage isSelected now that you're using enum
  const isSelected = node.node_status === "active" ? true : false;
  const isShown = node.isShown;

  const position = useSharedValue({ x: node.x || 0, y: node.y || 0 });
  const isRoot = useSharedValue(node.isCurrentRoot);
  const opacity = useSharedValue(node.isShown ? 1 : 0);

  const {
    inactiveBgColor,
    activeBgColor,
    inactiveBorderColor,
    activeBorderColor,
  } = getColors(node);

  const animatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(
      isRoot.value === true ? 1 : 0,
      [0, 1],
      [REG_NODE_RADIUS / 2, ROOT_NODE_RADIUS / 2],
    );

    const targetX = isRoot.value
      ? windowSize.windowCenterX - ROOT_NODE_RADIUS / 2
      : position.value.x - radius;
    const targetY = isRoot.value
      ? windowSize.windowCenterY - ROOT_NODE_RADIUS / 2
      : position.value.y - radius;

    return {
      position: "absolute",
      width: withTiming(radius * 2, { duration: 300 }),
      height: withTiming(radius * 2, { duration: 300 }),
      borderRadius: 100,
      borderWidth: 2,
      borderColor: withTiming(
        isSelected ? activeBorderColor : inactiveBorderColor,
        { duration: 200 },
      ),
      backgroundColor: withTiming(
        isSelected ? activeBgColor : inactiveBgColor,
        { duration: 200 },
      ),
      opacity: withTiming(opacity.value, { duration: 200 }),
      transform: [
        { translateX: withTiming(targetX, { duration: 300 }) },
        { translateY: withTiming(targetY, { duration: 300 }) },
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      isRoot.value === true ? 1 : 0,
      [1, 0],
      [ROOT_TEXT_SIZE, REG_TEXT_SIZE],
    );

    return {
      fontSize: withTiming(fontSize, { duration: 300 }),
    };
  });

  const tap = Gesture.Tap()
    .onStart(() => {
      // this line below is basically pointer events: "none"
      if (isShown) {
        dispatch(toggleNode(nodeId));
      }
      // centerOnNode(node);
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[{ ...styles.container }, animatedStyle]}>
        <Animated.Text
          style={[
            { ...styles.text },
            {
              color: isSelected ? "#c2ffef" : "#516e66",
            },
            animatedTextStyle,
          ]}
        >
          {node.first_name}
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
  },
});
