import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

import { TAB_BAR_HEIGHT } from "@/constants/styles";

export interface WindowSize {
  width: number;
  height: number;
  windowCenterX: number;
  windowCenterY: number;
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    const { width, height } = Dimensions.get("window");
    const adjHeight = height - TAB_BAR_HEIGHT;

    return {
      width,
      height,
      windowCenterX: width / 2,
      windowCenterY: adjHeight / 2,
    };
  });

  useEffect(() => {
    function handleChange({ window }: { window: ScaledSize }) {
      setWindowSize({
        width: window.width,
        height: window.height,
        windowCenterX: window.width / 2,
        windowCenterY: window.height / 2,
      });
    }

    const subscription = Dimensions.addEventListener("change", handleChange);

    return () => subscription.remove();
  }, []);

  return windowSize;
}

// !TODO: There are no bugs but you should have (a need to) set the height to "adjHeight" instead using the adjHeight in the windowCenterY calculation. There are a few things that get screwed up though if you make that change so you need to make sure the postion of all the nodes are correct and that the arrow correctly points after eventually changing this
