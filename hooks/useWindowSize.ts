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
      height: adjHeight,
      windowCenterX: width / 2,
      windowCenterY: adjHeight / 2,
    };
  });

  useEffect(() => {
    function handleChange({ window }: { window: ScaledSize }) {
      const adjHeight = window.height - TAB_BAR_HEIGHT;

      setWindowSize({
        width: window.width,
        height: adjHeight,
        windowCenterX: window.width / 2,
        windowCenterY: adjHeight / 2,
      });
    }

    const subscription = Dimensions.addEventListener("change", handleChange);

    return () => subscription.remove();
  }, []);

  return windowSize;
}
