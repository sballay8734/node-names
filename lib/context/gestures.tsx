import React, { createContext, useMemo, ReactNode, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import { SimultaneousGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition";
import {
  Easing,
  runOnJS,
  runOnUI,
  SharedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

export const MIN_SCALE = 0.3;
export const MAX_SCALE = 4;

export const INITIAL_SCALE = 1;
export const CENTER_ON_SCALE = 0.4;
export const SCALE_SENSITIVITY = 1.2;
const SPACER = 50;

export interface GestureContextType {
  composed: SimultaneousGesture;
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  lastScale: SharedValue<number>;
  initialFocalX: SharedValue<number>;
  initialFocalY: SharedValue<number>;
  centerShiftX: SharedValue<number>;
  centerShiftY: SharedValue<number>;
  rotate: SharedValue<number>;
  centerOnRoot: () => void;
  centerOnRootGroup: (
    group_x: number,
    group_y: number,
    groupAngle: number,
  ) => void;
}

export const GestureContext = createContext<GestureContextType | null>(null);

export const GestureProvider = ({ children }: { children: ReactNode }) => {
  const { windowCenterX, windowCenterY, height } = useAppSelector(
    (state: RootState) => state.windowSize,
  );
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);
  const initialFocalX = useSharedValue(0);
  const initialFocalY = useSharedValue(0);
  const centerShiftX = useSharedValue(0);
  const centerShiftY = useSharedValue(0);
  const rotate = useSharedValue(0);

  // Pinch gesture
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

          if (newScale !== scale.value) {
            const scaleChange = newScale / scale.value;
            scale.value = newScale;

            const adjustedFocalX = initialFocalX.value - translateX.value;
            const adjustedFocalY = initialFocalY.value - translateY.value;

            translateX.value -= adjustedFocalX * (scaleChange - 1);
            translateY.value -= adjustedFocalY * (scaleChange - 1);

            centerShiftX.value += adjustedFocalX * (scaleChange - 1);
            centerShiftY.value += adjustedFocalY * (scaleChange - 1);
          }
        })
        .onEnd(() => {
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

  // Pan gesture
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          translateX.value += e.changeX;
          translateY.value += e.changeY;

          // console.log("PAN - X:", translateX.value);
          // console.log("PAN - Y:", translateY.value);
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

  const composed = useMemo(
    () => Gesture.Simultaneous(pan, pinch),
    [pan, pinch],
  );

  function centerOnRoot() {
    runOnUI(() => {
      "worklet";
      const config = {
        duration: 300,
        easing: Easing.inOut(Easing.quad),
      };

      translateX.value = withTiming(0, config);
      translateY.value = withTiming(0, config);
      scale.value = withTiming(INITIAL_SCALE, config);

      lastScale.value = INITIAL_SCALE;
      initialFocalX.value = 0;
      initialFocalY.value = 0;
      centerShiftX.value = 0;
      centerShiftY.value = 0;
    })();
  }
  function centerOnRootGroup(
    group_x: number,
    group_y: number,
    groupAngle: number,
  ) {
    // translateX.value = withTiming(windowCenterX - group_x, {
    //   duration: 400,
    // });
    // translateY.value = withTiming(height - group_y - SPACER, {
    //   duration: 400,
    // });
    // rotate.value = withTiming(groupAngle, { duration: 400 });
  }

  const gestures = {
    composed,
    scale,
    translateX,
    translateY,
    lastScale,
    initialFocalX,
    initialFocalY,
    centerShiftX,
    centerShiftY,
    rotate,
    centerOnRoot,
    centerOnRootGroup,
  };

  return (
    <GestureContext.Provider value={gestures}>
      {children}
    </GestureContext.Provider>
  );
};
