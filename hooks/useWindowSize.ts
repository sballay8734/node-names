import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

interface WindowSize {
  width: number;
  height: number;
  windowCenterX: number;
  windowCenterY: number;
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    const { width, height } = Dimensions.get("window");
    return {
      width,
      height,
      windowCenterX: width / 2,
      windowCenterY: height / 2.3,
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
