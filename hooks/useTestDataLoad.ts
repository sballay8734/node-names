import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useGestures } from "@/features/Graph/hooks/useGestures";
import {
  setLinks,
  setNodes,
} from "@/features/SelectionManagement/redux/manageSelections";
import useDbData from "@/hooks/useDbData";
import useWindowSize from "@/hooks/useWindowSize";
import getPrimaryConnectionsAndNodes from "@/utils/getPrimaryConnections";
import {
  calcPrimaryPositions,
  FinalizedLink,
} from "@/utils/positionGraphElements";

export const useTestDataLoad = () => {
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const { scale } = useGestures();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { people, connections } = useDbData();

  // get rootNode
  const rootNode = people && people.find((n) => n.isRoot === true);

  const primaryConnectionsAndNodes =
    rootNode && connections
      ? getPrimaryConnectionsAndNodes(rootNode, connections, people)
      : null;

  useEffect(() => {
    if (!primaryConnectionsAndNodes) {
      return;
    }

    const { primaryConnections, primaryNodes } = primaryConnectionsAndNodes;

    if (!dataLoaded && people && connections && rootNode) {
      const { nodes, links } = calcPrimaryPositions(
        primaryNodes,
        primaryConnections,
        windowSize,
        scale,
      );

      dispatch(setNodes([...nodes]));
      dispatch(setLinks(links as FinalizedLink[]));
      setDataLoaded(true);
    }
  }, [
    dataLoaded,
    people,
    windowSize,
    connections,
    dispatch,
    primaryConnectionsAndNodes,
    rootNode,
    scale,
  ]);

  return dataLoaded;
};
