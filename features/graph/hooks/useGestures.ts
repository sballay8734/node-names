import { Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const INITIAL_SCALE = 0.5;

export const useGestures = () => {
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);

  const pan = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
  });

  const pinch = Gesture.Pinch()
    .onChange((e) => {
      const newScale = Math.min(
        Math.max(scale.value * e.scale, MIN_SCALE),
        MAX_SCALE,
      );

      scale.value = newScale;
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const composed = Gesture.Race(pan, pinch);

  return { composed, scale, translateX, translateY, lastScale };
};
