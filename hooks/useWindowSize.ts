import { useEffect, useState, useMemo } from "react";
import { Dimensions, ScaledSize } from "react-native";

import { TAB_BAR_HEIGHT } from "@/constants/styles";

export interface WindowSize {
  width: number;
  height: number;
  windowCenterX: number;
  windowCenterY: number;
}

export default function useWindowSize() {
  const initialWindowSize = useMemo(() => {
    const { width, height } = Dimensions.get("window");
    const adjHeight = height - TAB_BAR_HEIGHT;

    return {
      width,
      height: adjHeight,
      windowCenterX: width / 2,
      windowCenterY: adjHeight / 2,
    };
  }, []);

  const [windowSize, setWindowSize] = useState<WindowSize>(initialWindowSize);

  useEffect(() => {
    console.log(
      `[${new Date().toISOString()}] RUNNING useEffect in useWindowSize`,
    );
    function handleChange({ window }: { window: ScaledSize }) {
      const adjHeight = window.height - TAB_BAR_HEIGHT;

      if (
        window.width !== windowSize.width ||
        adjHeight !== windowSize.height
      ) {
        setWindowSize({
          width: window.width,
          height: adjHeight,
          windowCenterX: window.width / 2,
          windowCenterY: adjHeight / 2,
        });
      }
    }

    const subscription = Dimensions.addEventListener("change", handleChange);

    return () => subscription.remove();
  }, [windowSize]);

  return windowSize;
}
