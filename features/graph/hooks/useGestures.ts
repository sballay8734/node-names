import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, withDecay } from "react-native-reanimated";

import useWindowSize from "@/hooks/useWindowSize";

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
// export const INITIAL_SCALE = 0.5;
export const INITIAL_SCALE = 1;
const SCALE_SENSITIVITY = 1.2;

export const useGestures = () => {
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);

  const windowSize = useWindowSize();

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const initialFocalX = useSharedValue(0);
  const initialFocalY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
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
    });

  const pinch = Gesture.Pinch()
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
        translateX.value = translateX.value * scaleChange;
        translateY.value = translateY.value * scaleChange;
      }
    })
    .onEnd((e) => {
      lastScale.value = scale.value;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  return {
    composed,
    scale,
    translateX,
    translateY,
    lastScale,
    focalX,
    focalY,
  };
};

// !TODO: Consider wrapping your gesture configurations with useMemo, as it will reduce the amount of work Gesture Handler has to do under the hood when updating gestures. (FROM DOCS: https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture)
