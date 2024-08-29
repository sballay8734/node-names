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
} from "@/constants/variables";
import { useAppDispatch, useAppSelector } from "@/lib/constants/reduxHooks";
import { UiVertex } from "@/lib/types/database";
import { RootState } from "@/store/store";

import { getColors } from "../../../lib/utils/getColors";
import { toggleVertex } from "../redux/graphDataManagement";

interface Props {
  vertexId: number;
  centerOnNode: (node: UiVertex) => void;
}

// !TODO: PROPS MAY NOT BE EQUAL BECAUSE YOU'RE PASSING A FUNCTION

export default function NodeTapDetector({ vertexId, centerOnNode }: Props) {
  const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const vertex = useAppSelector(
    (state: RootState) => state.graphData.vertices.byId[vertexId],
  );

  // !TODO: Need a better way to manage isSelected now that you're using enum
  const isSelected = vertex.vertex_status === "active" ? true : false;
  const isShown = vertex.isShown;

  const position = useSharedValue({ x: vertex.x || 0, y: vertex.y || 0 });
  const isRoot = useSharedValue(vertex.isCurrentRoot);
  const opacity = useSharedValue(vertex.isShown ? 1 : 0);

  const {
    inactiveBgColor,
    activeBgColor,
    inactiveBorderColor,
    activeBorderColor,
  } = getColors(vertex);

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
        dispatch(toggleVertex(vertexId));
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
          {vertex.first_name}
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
