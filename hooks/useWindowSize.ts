import { useEffect, useMemo } from "react";
import { Dimensions, ScaledSize } from "react-native";

import { TAB_BAR_HEIGHT } from "@/constants/styles";
import { updateWindowSize } from "@/features/Shared/redux/windowSize";
import { RootState } from "@/store/store";

import { useAppDispatch, useAppSelector } from "./reduxHooks";

export interface WindowSize {
  width: number;
  height: number;
  windowCenterX: number;
  windowCenterY: number;
}

const useWindowSize = () => {
  const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] Rendering useWindowSize`);
    function handleChange({ window }: { window: ScaledSize }) {
      const adjHeight = window.height - TAB_BAR_HEIGHT;

      if (
        window.width !== windowSize.width ||
        adjHeight !== windowSize.height
      ) {
        dispatch(
          updateWindowSize({
            width: window.width,
            height: adjHeight,
            windowCenterX: window.width / 2,
            windowCenterY: adjHeight / 2,
          }),
        );
      }
    }

    const subscription = Dimensions.addEventListener("change", handleChange);

    return () => subscription.remove();
  }, [dispatch, windowSize]);

  return useMemo(() => windowSize, [windowSize]);
};

export default useWindowSize;
