import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  calcPrimaryPositions,
  FinalizedLink,
} from "@/features/D3/utils/positionGraphElements";
import { useGestures } from "@/features/Graph/hooks/useGestures";
import getPrimaryConnectionsAndNodes from "@/features/Graph/utils/getPrimaryConnections";
import {
  setLinks,
  setNodes,
} from "@/features/SelectionManagement/redux/manageSelections";
import useDbData from "@/hooks/useDbData";
import useWindowSize from "@/hooks/useWindowSize";

export const useDataLoad = () => {
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
