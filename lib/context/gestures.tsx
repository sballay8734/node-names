import React, { createContext, useMemo, ReactNode, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import { SimultaneousGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition";
import {
  SharedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from "react-native-reanimated";

export const MIN_SCALE = 0.3;
export const MAX_SCALE = 4;

export const INITIAL_SCALE = 1;
export const CENTER_ON_SCALE = 0.4;
export const SCALE_SENSITIVITY = 1.2;

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
  center: () => void;
}

export const GestureContext = createContext<GestureContextType | null>(null);

export const GestureProvider = ({ children }: { children: ReactNode }) => {
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);
  const initialFocalX = useSharedValue(0);
  const initialFocalY = useSharedValue(0);
  const centerShiftX = useSharedValue(0);
  const centerShiftY = useSharedValue(0);

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

  function center() {
    // TODO: Not sure you should use withTiming outside of styles but it works
    scale.value = withTiming(INITIAL_SCALE, { duration: 200 });
    translateX.value = withTiming(0, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
    // scale.value = INITIAL_SCALE;
    // translateX.value = 0;
    // translateY.value = 0;
    lastScale.value = INITIAL_SCALE;
    initialFocalX.value = 0;
    initialFocalY.value = 0;
    centerShiftX.value = 0;
    centerShiftY.value = 0;
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
    center,
  };

  return (
    <GestureContext.Provider value={gestures}>
      {children}
    </GestureContext.Provider>
  );
};
