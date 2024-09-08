import { Canvas, Fill, Group } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { Provider } from "react-redux";

import { GRAPH_BG_COLOR } from "@/lib/constants/Colors";
import { nodes, links } from "@/lib/data/new_structure";
import {
  INITIAL_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_SENSITIVITY,
} from "@/lib/hooks/useGestures";
import { positionGraphEls } from "@/lib/utils/positionGraphEls";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState, store } from "@/store/store";

import GraphOverlayButtons from "./GraphOverlay/GraphOverlayButtons";
import PressableElements from "./PressableElements";
import SvgElements from "./SvgElements";

// REMOVE:
const thisData = {
  nodes,
  links,
};

export default function Graph() {
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const { data } = positionGraphEls(thisData, windowSize);
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);
  const initialFocalX = useSharedValue(0);
  const initialFocalY = useSharedValue(0);

  // Shared values to track how much the center shifts
  const centerShiftX = useSharedValue(0);
  const centerShiftY = useSharedValue(0);

  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .onStart((e) => {
          initialFocalX.value = e.focalX;
          initialFocalY.value = e.focalY;
        })
        .onChange((e) => {
          const scaleFactor = 1 + (e.scale - 1) * SCALE_SENSITIVITY;
          const newScale = Math.min(
            Math.max(lastScale.value * scaleFactor, MIN_SCALE),
            MAX_SCALE,
          );

          // only apply translation if the scale is actually changing
          if (newScale !== scale.value) {
            // Calculate the change in scale
            const scaleChange = newScale / scale.value;

            // Update the scale
            scale.value = newScale;

            // Adjust the translation to keep the center point fixed
            const adjustedFocalX = initialFocalX.value - translateX.value;
            const adjustedFocalY = initialFocalY.value - translateY.value;

            translateX.value -= adjustedFocalX * (scaleChange - 1);
            translateY.value -= adjustedFocalY * (scaleChange - 1);

            centerShiftX.value += adjustedFocalX * (scaleChange - 1);
            centerShiftY.value += adjustedFocalY * (scaleChange - 1);
          }
        })
        .onEnd((e) => {
          lastScale.value = scale.value;
        }),
    [
      initialFocalX,
      initialFocalY,
      lastScale,
      scale,
      translateX,
      translateY,
      centerShiftX,
      centerShiftY,
    ],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          translateX.value += e.changeX;
          translateY.value += e.changeY;

          // centerShiftX.value += e.changeX;
          // centerShiftY.value += e.changeY;
        })
        .onEnd((e) => {
          translateX.value = withDecay({
            velocity: e.velocityX,
            deceleration: 0.995,
          });
          translateY.value = withDecay({
            velocity: e.velocityY,
            deceleration: 0.995,
          });
        }),
    [translateX, translateY],
  );

  const transform = useDerivedValue(() => {
    return [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ];
  });

  const composed = useMemo(
    () => Gesture.Simultaneous(pan, pinch),
    [pan, pinch],
  );

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
            {/* NOTE: Unfortunately, wrapping the children in another provider is currently needed. See (https://shopify.github.io/react-native-skia/docs/canvas/contexts/) */}
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
