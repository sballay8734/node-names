import useWindowSize from "@/hooks/useWindowSize";
import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, withDecay } from "react-native-reanimated";

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
export const INITIAL_SCALE = 0.5;
const SCALE_SENSITIVITY = 1.2;

export const useGestures = () => {
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);
  const windowSize = useWindowSize();

  // !TODO: ALERT (You're already using origin in LinksCanvas.tsx to set initial position of Group inside canvas! IMPORTANT!!!!!!!)
  const origin = useSharedValue({
    x: windowSize.windowCenterX,
    y: windowSize.windowCenterY,
  });
  const testOrigin = useSharedValue({
    x: 0,
    y: 0,
  });

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

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
      focalX.value = e.focalX;
      focalY.value = e.focalY;
      console.log("WINDOW:", windowSize);
    })
    .onChange((e) => {
      const scaleFactor = 1 + (e.scale - 1) * SCALE_SENSITIVITY;
      const newScale = Math.min(
        Math.max(lastScale.value * scaleFactor, MIN_SCALE),
        MAX_SCALE,
      );

      // get point on canvas that maps to focal point
      console.log("focalX:", focalX.value);
      console.log("focalY:", focalY.value);

      // GOOD!!!
      const canvasFocalX =
        focalX.value * newScale + (windowSize.width / 2) * newScale;
      const canvasFocalY =
        focalY.value * newScale + (windowSize.width / 2) * newScale;

      // !TODO: FROM HERE AND BELOW NEEDS FIXING
      const differenceX = focalX.value - canvasFocalX;
      const differenceY = focalY.value - canvasFocalY;

      console.log("CANVAS_X:", canvasFocalX);
      console.log("CANVAS_Y:", canvasFocalY);

      console.log("DIF_X:", differenceX);
      console.log("DIF_Y:", differenceY);

      // Apply the new scale
      scale.value = newScale;

      scale.value = newScale;
      focalX.value = e.focalX;
      focalY.value = e.focalY;
      translateX.value += Math.min(1, Math.abs(differenceX));
      translateY.value += Math.min(1, Math.abs(differenceY));
    })
    .onEnd((e) => {
      lastScale.value = scale.value;
    });

  const composed = Gesture.Race(pan, pinch);

  return {
    composed,
    scale,
    translateX,
    translateY,
    lastScale,
    focalX,
    focalY,
    origin,
  };
};
