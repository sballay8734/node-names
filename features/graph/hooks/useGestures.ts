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

  // !TODO: ALERT (You're already using origin in LinksCanvas.tsx to set initial position of Group inside canvas! IMPORTANT!!!!!!!)
  const origin = useSharedValue({
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
    .onChange((e) => {
      const scaleFactor = 1 + (e.scale - 1) * SCALE_SENSITIVITY;
      const newScale = Math.min(
        Math.max(lastScale.value * scaleFactor, MIN_SCALE),
        MAX_SCALE,
      );

      scale.value = newScale;
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onEnd(() => {
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
  };
};
