import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { PositionedNode } from "@/features/D3/types/d3Types";
import {
  CENTER_ON_SCALE,
  INITIAL_SCALE,
  useGestures,
} from "@/features/Graph/hooks/useGestures";
import {
  setActiveRootNode,
  updateRootNode,
} from "@/features/Graph/redux/graphManagement";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

export default function InspectBtn(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { translateX, translateY, scale, lastScale } = useGestures();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);

  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);
  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );
  const activeRootNode = useAppSelector(
    (state: RootState) => state.manageGraph.activeRootNode,
  );
  const selectedNodeCount = useAppSelector(
    (state: RootState) => state.selections.selectedNodes.length,
  );

  const rootNodeIsSelected = useAppSelector((state: RootState) => {
    return (
      activeRootNode &&
      state.selections.selectedNodes.length === 1 &&
      state.selections.selectedNodes[0].id === activeRootNode.id
    );
  });

  const centerOnRoot = useCallback(() => {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    scale.value = withTiming(
      INITIAL_SCALE,
      { duration: 500, easing: Easing.bezier(0.35, 0.68, 0.58, 1) },
      (finished) => {
        if (finished) {
          lastScale.value = scale.value;
        }
      },
    );
  }, [translateX, translateY, scale, lastScale]);

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
  }

  function handlePressOut() {
    if (
      (selectedNodeCount === 1 && selectedNodes[0].depth_from_user > 2) ||
      !activeRootNode
    ) {
      isPressed.value = false;
      return;
    }

    if (
      selectedNodeCount === 1 &&
      !rootNodeIsSelected &&
      !longPressRef.current &&
      // TODO: This line currently disallows inspecting deeper nested nodes until you fix the data structure to simplify the logic for handling it
      selectedNodes[0].depth_from_user < 2
    ) {
      dispatch(
        updateRootNode({
          newRootId: selectedNodes[0].id,
          oldRootNode: activeRootNode,
        }),
      );
      dispatch(setActiveRootNode(selectedNodes[0]));
      centerOnRoot();
    }
    isPressed.value = false;
  }

  function handleLongPress() {
    longPressRef.current = true;
  }

  const inspectBtnStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        selectedNodeCount === 1 &&
          !rootNodeIsSelected &&
          selectedNodes[0].shallowest_ancestor === 1
          ? 1
          : (selectedNodeCount === 1 && rootNodeIsSelected) ||
            (selectedNodeCount === 1 &&
              selectedNodes[0].shallowest_ancestor !== 1)
          ? 0.3
          : selectedNodeCount > 1
          ? 0.3
          : 0,
        { duration: 200 },
      ),
      pointerEvents:
        selectedNodeCount === 1 && !rootNodeIsSelected ? "auto" : "none",
      backgroundColor: withTiming(
        isPressed.value ? "rgba(15,15,15,1)" : "rgba(0,0,0,1)",
        {
          duration: 200,
        },
      ),
    };
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      color: withTiming(isPressed.value ? "#878787" : "#ffffff", {
        duration: 200,
      }),
    };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      style={[styles.recenterButton, inspectBtnStyles]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.scan]}>
          <AnimatedIcon
            name="magnify-scan"
            size={24}
            animatedProps={animatedProps}
          />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  recenterButton: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    right: 10,
    // height: ARROW_BTN_RADIUS * 2,
    // width: ARROW_BTN_RADIUS * 2,
    padding: 10,
    borderRadius: 100,
    borderColor: "#232a2b",
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  buttonContent: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  scan: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
