import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ILink } from "@/features/D3/types/d3Types";
import { calcPrimaryPositions } from "@/features/D3/utils/positionGraphElements";
import { useGestures } from "@/features/Graph/hooks/useGestures";
import getPrimaryConnectionsAndNodes from "@/features/Graph/utils/getPrimaryConnections";
import {
  setLinks,
  setNodes,
} from "@/features/SelectionManagement/redux/manageSelections";
import useDbData from "@/hooks/useDbData";
import useWindowSize from "@/hooks/useWindowSize";

// Steps to perform when data is returned
// 1. get Root primaryConnections (Links AND Nodes)
// 2. get primaryConnections for each primaryConnection (Links AND Nodes)
// 2a. // !TODO: BIG QUESTION, WHERE/HOW TO STORE THE PRIMARY CONNECTIONS OF THE ROOT PRIMARY CONNECTIONS

export const useDataLoad = () => {
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const { scale } = useGestures();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { people, connections } = useDbData();

  // get rootNode
  const rootNode = people && people.find((n) => n.isRoot === true);

  // get primary connections for rootNode (user)
  const primaryConnectionsAndNodes =
    rootNode && connections
      ? getPrimaryConnectionsAndNodes(rootNode, connections, people)
      : null;

  // get primary connections for each primary connection of root
  const secondaryConnectionsAndNodes = null;

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
      dispatch(setLinks(links as ILink[]));
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
