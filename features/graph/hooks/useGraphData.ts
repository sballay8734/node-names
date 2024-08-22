import { useEffect } from "react";
import { Easing, SharedValue, withTiming } from "react-native-reanimated";

import { PositionedNode } from "@/features/D3/types/d3Types";
import { calcNodePositions } from "@/features/D3/utils/getNodePositions";
import {
  setUserNodes,
  setUserLinks,
  INode2,
} from "@/features/Graph/redux/graphManagement";
import { getShownNodesAndConnections } from "@/features/Graph/utils/getShownNodesAndConnections";
import { useDataLoad } from "@/features/Graph/utils/useDataLoad";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { WindowSize } from "@/hooks/useWindowSize";

import { CENTER_ON_SCALE, INITIAL_SCALE } from "./useGestures";

export interface Props {
  activeRootNode: INode2;
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
  const { people, connections } = useDataLoad();

  useEffect(() => {
    if (activeRootNode && people && connections) {
      const { nodeObj, finalConnections } = getShownNodesAndConnections(
        people,
        connections,
        activeRootNode,
      );
      if (!nodeObj) return;

      const { nodes, links } = calcNodePositions(
        people,
        nodeObj,
        finalConnections,
        windowSize,
        scale,
        activeRootNode,
      );
      dispatch(setUserNodes(nodes));
      dispatch(setUserLinks(links));
      centerOnRoot();
    }
  }, [activeRootNode, connections, dispatch, people, scale, windowSize]);

  function centerOnRoot() {
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
  }

  function centerOnNode(node: PositionedNode) {
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
  }

  return { centerOnRoot, centerOnNode, arrowData: [], showArrow: false };
};
