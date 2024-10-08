import { useEffect, useMemo } from "react";
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
import { PositionedNode } from "@/features/D3/types/d3Types";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { handleNodeSelect } from "../../SelectionManagement/redux/manageSelections";
import { getColors } from "../helpers/getColors";
import { NodeHashObj } from "../utils/getInitialNodes";

interface Props {
  node: NodeHashObj;
  centerOnNode: (node: PositionedNode) => void;
}

export default function NodeTapDetector({ node, centerOnNode }: Props) {
  const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const isSelected = useAppSelector((state: RootState) =>
    state.selections.selectedNodes.includes(node.id),
  );
  const isShown = useMemo(() => node.isShown, [node.isShown]);

  const position = useSharedValue({ x: node.x, y: node.y });
  const isRoot = useSharedValue(node.is_current_root);
  const opacity = useSharedValue(0);

  useEffect(() => {
    isRoot.value = node.is_current_root;
    position.value = { x: node.x, y: node.y };
    opacity.value = node.isShown ? 1 : 0;
  }, [
    node.is_current_root,
    node.x,
    node.y,
    isRoot,
    position,
    node.isShown,
    opacity,
  ]);

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
        dispatch(handleNodeSelect(node.id));
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
