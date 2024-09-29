import { useCallback } from "react";
import { Easing, SharedValue, withTiming } from "react-native-reanimated";

import { WindowSize } from "@/lib/types/misc";

import { UiNode } from "../types/graph";
import { CENTER_ON_SCALE, INITIAL_SCALE } from "../context/gestures";

export interface Props {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  windowSize: WindowSize;
  lastScale: SharedValue<number>;
}

export const useGraphData = ({
  scale,
  translateX,
  translateY,
  windowSize,
  lastScale,
}: Props) => {
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

  const centerOnNode = useCallback(
    (node: UiNode) => {
      translateX.value = withTiming(
        (windowSize.windowCenterX - node.x!) * CENTER_ON_SCALE,
        {
          duration: 500,
          easing: Easing.bezier(0.35, 0.68, 0.58, 1),
        },
      );
      translateY.value = withTiming(
        (windowSize.windowCenterY - node.y!) * CENTER_ON_SCALE,
        {
          duration: 500,
          easing: Easing.bezier(0.35, 0.68, 0.58, 1),
        },
      );
      scale.value = withTiming(CENTER_ON_SCALE, {
        duration: 500,
        easing: Easing.bezier(0.35, 0.68, 0.58, 1),
      });
      lastScale.value = CENTER_ON_SCALE;
    },
    [translateX, translateY, scale, lastScale, windowSize],
  );

  return { centerOnRoot, centerOnNode };
};
