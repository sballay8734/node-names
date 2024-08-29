import { useEffect, useMemo } from "react";
import { Dimensions, ScaledSize } from "react-native";

import { updateWindowSize } from "@/features/Graph/redux/windowSize";
import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { RootState } from "@/store/store";

import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";

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

  return useMemo(
    () => ({
      width: windowSize.width,
      height: windowSize.height,
      windowCenterX: windowSize.windowCenterX,
      windowCenterY: windowSize.windowCenterY,
    }),
    [
      windowSize.width,
      windowSize.height,
      windowSize.windowCenterX,
      windowSize.windowCenterY,
    ],
  );
};

export default useWindowSize;
