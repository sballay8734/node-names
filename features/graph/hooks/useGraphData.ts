import { useCallback, useEffect, useMemo, useRef } from "react";
import { Easing, SharedValue, withTiming } from "react-native-reanimated";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";
import { calcNodePositions } from "@/features/D3/utils/getNodePositions";
import {
  setUserNodes,
  setUserLinks,
  updateUserNodes,
} from "@/features/Graph/redux/graphManagement";
import { getShownNodesAndConnections } from "@/features/Graph/utils/getShownNodesAndConnections";
import { useDataLoad } from "@/features/Graph/utils/useDataLoad";
import { useArrowData } from "@/features/GraphActions/hooks/useArrowData";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { WindowSize } from "@/hooks/useWindowSize";

import { INode2 } from "../types/graphManagementTypes";

import { CENTER_ON_SCALE, INITIAL_SCALE } from "./useGestures";

export interface Props {
  activeRootNode: INode2 | null;
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  windowSize: WindowSize;
  lastScale: SharedValue<number>;
}

export const useGraphData = ({
  activeRootNode,
  scale,
  translateX,
  translateY,
  windowSize,
  lastScale,
}: Props) => {
  const dispatch = useAppDispatch();
  const { people, connections } = useDataLoad(); // it's not this...
  const { arrowData, showArrow } = useArrowData({ translateX, translateY });
  const cachedNodes = useRef<PositionedNode[] | null>(null);

  const { nodeHash, finalConnections } = useMemo(() => {
    if (people && connections && activeRootNode) {
      return getShownNodesAndConnections(people, connections, activeRootNode);
    }
    return { nodeHash: null, finalConnections: [] };
  }, [people, connections, activeRootNode]);

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
    if (!nodeHash || !activeRootNode) return;

    const nodeHashCopy = { ...nodeHash };
    // !TODO: cache currentRootId and compare to determine if you need to calc

    // !TODO: if positions need to be calculated run this
    if (people) {
      const { nodes, links } = calcNodePositions(
        people,
        nodeHash,
        finalConnections,
        windowSize,
        scale,
        activeRootNode,
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
      // !TODO: Otherwise, JUST update isShown somehow
      if (cachedNodes.current) {
        dispatch(updateUserNodes(cachedNodes.current));
      }
    }
    // dispatch(setUserLinks(cachedLinks.current));
    centerOnRoot();
  }, [
    people,
    activeRootNode,
    nodeHash,
    finalConnections,
    dispatch,
    scale,
    windowSize,
    centerOnRoot,
  ]);

  return { centerOnRoot, centerOnNode, arrowData, showArrow };
};

// !TODO: CHECK EVERY REFERENCE TO activeRootNode to see where it is causing UNECESSARY re-renders (NodeTapDetector-(rootNodeId), index-(GestureDetector being reinitialized?), InspectBtn, BackToUserBtn, )
// HERE ARE ALL THE THINGS THAT HAPPEN WHEN INSPECT IS PRESSED
// 1. activeRootNode is changed
// 2.
