import { Canvas, Circle, Fill, Group } from "@shopify/react-native-skia";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { Provider } from "react-redux";

import { GRAPH_BG_COLOR } from "@/lib/constants/Colors";
import { testLinks, testNodes } from "@/lib/data/new_structure";
import { useGestureContext } from "@/lib/hooks/useGestureContext";
import {
  CIRCLE_RADIUS,
  positionNodesOnLoad,
} from "@/lib/utils/positionNodesOnLoad";
import { repositionNodes } from "@/lib/utils/repositionNodes";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState, store } from "@/store/store";

import { setInitialState, updateNodePositions } from "../redux/graphSlice";

import GraphOverlayButtons from "./GraphOverlay/GraphOverlayButtons";
import PressableElements from "./PressableElements";
import SvgElements from "./SvgElements";

export default function Graph() {
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const gestures = useGestureContext();
  const dispatch = useAppDispatch();
  const nodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );

  const isInitialRender = useRef(true);

  // Handle initial positioning
  useEffect(() => {
    if (isInitialRender.current && nodeIds.length === 0) {
      const initialState = positionNodesOnLoad(
        testNodes,
        testLinks,
        windowSize,
      );
      console.log("INITIAL RENDER");
      dispatch(setInitialState(initialState));
      isInitialRender.current = false;
    }
  }, []);

  // // Handle repositioning
  // useEffect(() => {
  //   if (!isInitialRender.current && nodeIds.length > 0) {
  //     console.log("REPOSITIONING", nodeIds);
  //     dispatch(updateNodePositions({ nodeIds, windowSize }));
  //   }
  // }, [nodeIds, dispatch, windowSize]);

  const transform = useDerivedValue(() => {
    return [
      { translateX: gestures.translateX.value },
      { translateY: gestures.translateY.value },
      { scale: gestures.scale.value },
    ];
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: gestures.translateX.value },
        { translateY: gestures.translateY.value },
        { scale: gestures.scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={gestures.composed}>
      <View style={{ flex: 1 }}>
        <Canvas
          style={{
            flex: 1,
          }}
        >
          <Fill color={GRAPH_BG_COLOR} />
          <Group transform={transform}>
            <Circle
              color={"#242d45"}
              r={CIRCLE_RADIUS}
              style={"stroke"}
              strokeWidth={0.1}
              cx={windowSize.windowCenterX}
              cy={windowSize.windowCenterY}
            />
            <Circle
              color={"#242d45"}
              r={CIRCLE_RADIUS * 3}
              style={"stroke"}
              strokeWidth={0.1}
              cx={windowSize.windowCenterX}
              cy={windowSize.windowCenterY}
            />
            <Circle
              color={"#242d45"}
              r={CIRCLE_RADIUS * 4}
              style={"stroke"}
              strokeWidth={0.1}
              cx={windowSize.windowCenterX}
              cy={windowSize.windowCenterY}
            />
            <Circle
              color={"#242d45"}
              r={CIRCLE_RADIUS * 5}
              style={"stroke"}
              strokeWidth={0.1}
              cx={windowSize.windowCenterX}
              cy={windowSize.windowCenterY}
            />
            {/* <GestureProvider> */}
            <Provider store={store}>
              <SvgElements gestures={gestures} />
            </Provider>
            {/* </GestureProvider> */}
          </Group>
        </Canvas>
        <Animated.View style={[styles.wrapper, animatedStyle]}>
          <PressableElements />
        </Animated.View>
        <GraphOverlayButtons gestures={gestures} windowSize={windowSize} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
    transformOrigin: "left top",
    // pointerEvents: "box-none",
  },
});

//
