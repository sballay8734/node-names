import { Canvas, Circle, Fill, Group } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { Provider } from "react-redux";

import { GRAPH_BG_COLOR } from "@/lib/constants/Colors";
import { testLinks, testNodes } from "@/lib/data/new_structure";
import { useGestures } from "@/lib/hooks/useGestures";
import { CIRCLE_RADIUS, newNewPosFunc } from "@/lib/utils/positionGraphEls";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState, store } from "@/store/store";

import GraphOverlayButtons from "./GraphOverlay/GraphOverlayButtons";
import PressableElements from "./PressableElements";
import SvgElements from "./SvgElements";

export default function Graph() {
  const windowSize = useAppSelector((state: RootState) => state.windowSize);

  // !TODO: This will be changed
  useEffect(() => {
    // newINITPosFunc(testNodes, testLinks, windowSize);
    newNewPosFunc(testNodes, testLinks, windowSize);
  }, [windowSize]);

  const {
    scale,
    translateX,
    translateY,
    composed,
    lastScale,
    initialFocalX,
    initialFocalY,
    centerShiftX,
    centerShiftY,
  } = useGestures();

  const transform = useDerivedValue(() => {
    return [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ];
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={composed}>
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
            <Provider store={store}>
              <SvgElements />
            </Provider>
          </Group>
        </Canvas>
        <Animated.View style={[styles.wrapper, animatedStyle]}>
          <PressableElements />
        </Animated.View>
        <GraphOverlayButtons
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          lastScale={lastScale}
          windowSize={windowSize}
          initialFocalX={initialFocalX}
          initialFocalY={initialFocalY}
          centerShiftX={centerShiftX}
          centerShiftY={centerShiftY}
        />
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
