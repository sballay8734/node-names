import { useDerivedValue } from "react-native-reanimated";

import { centerNode } from "@/constants/variables";
import { ARROW_BTN_RADIUS, TAB_BAR_HEIGHT } from "@/constants/styles";
import useWindowSize from "@/hooks/useWindowSize";

import { useGestures } from "./useGestures";

interface Props {
  translateX: any;
  translateY: any;
}

export const useArrowData = ({ translateX, translateY }: Props) => {
  const windowSize = useWindowSize();
  const { scale } = useGestures();

  // rootNode center postion
  const { nodeCenterX, nodeCenterY } = centerNode(
    windowSize,
    "root",
    "d3",
    scale,
  );

  const ARROW_BTN_LEFT = 10;
  const ARROW_BTN_BTM = 10;

  const ARROW_BTN_CENTER = {
    x: ARROW_BTN_LEFT + ARROW_BTN_RADIUS,
    y: windowSize.height - ARROW_BTN_BTM - ARROW_BTN_RADIUS,
  };

  const arrowData = useDerivedValue(() => {
    const rootNodePos = {
      x: nodeCenterX + translateX.value,
      y: nodeCenterY + translateY.value,
    };

    const dx = rootNodePos.x - ARROW_BTN_CENTER.x;
    const dy = rootNodePos.y - ARROW_BTN_CENTER.y;

    const angle = Math.atan2(dy, dx);

    const angleInDegrees = (angle * 180) / Math.PI;

    return {
      transform: [{ rotate: `${angleInDegrees}deg` }],
    };
  });

  const showArrow = useDerivedValue(() => {
    // returns true if x or y of root node is off the screen
    return (
      nodeCenterX - Math.abs(translateX.value) < 0 ||
      nodeCenterY - Math.abs(translateY.value) < 0
    );
  });

  return { arrowData, showArrow };
};
