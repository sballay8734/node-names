import { useCallback, useEffect, useMemo, useRef } from "react";
import { Easing, SharedValue, withTiming } from "react-native-reanimated";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";
import { calcNodePositions } from "@/features/D3/utils/getNodePositions";
import {
  setUserNodes,
  setUserLinks,
} from "@/features/Graph/redux/graphManagement";
import { useDataLoad } from "@/features/Graph/utils/useDataLoad";
import { useArrowData } from "@/features/GraphActions/hooks/useArrowData";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { WindowSize } from "@/hooks/useWindowSize";

import { getInitialNodes } from "../utils/getInitialNodes";

import { CENTER_ON_SCALE, INITIAL_SCALE } from "./useGestures";

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
  console.log(`[${new Date().toISOString()}] Running useGraphData...`);
  const dispatch = useAppDispatch();
  const { people, connections } = useDataLoad();
  const { arrowData, showArrow } = useArrowData({
    translateX,
    translateY,
    scale,
  });
  const cachedNodes = useRef<PositionedNode[] | null>(null);

  const { nodeHash, finalConnections } = useMemo(() => {
    if (people && connections) {
      return getInitialNodes(people, connections);
    }
    return { nodeHash: null, finalConnections: [] };
  }, [people, connections]);

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
    (node: PositionedNode) => {
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

  useEffect(() => {
    if (!nodeHash) return;

    const nodeHashCopy = { ...nodeHash };

    if (people) {
      const { nodes, links } = calcNodePositions(
        people,
        nodeHash,
        finalConnections,
        windowSize,
        scale,
      );

      nodes.forEach((n) => {
        const { id, x, y } = n;

        if (nodeHashCopy[id]) {
          nodeHashCopy[id] = {
            ...nodeHashCopy[id],
            x: x as number,
            y: y as number,
          };
        }
      });
      dispatch(setUserNodes(nodeHashCopy));
      // cache nodes
      cachedNodes.current = nodes;
    } else {
      console.error("useGraphData.ts ERROR");
      // if (cachedNodes.current) {
      //   dispatch(updateUserNodes(cachedNodes.current));
      // }
    }
    centerOnRoot();
  }, [
    people,
    nodeHash,
    finalConnections,
    dispatch,
    scale,
    windowSize,
    centerOnRoot,
  ]);

  return { centerOnRoot, centerOnNode, arrowData, showArrow };
};
