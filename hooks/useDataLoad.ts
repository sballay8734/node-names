import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ILink } from "@/features/D3/types/d3Types";
import { calcPrimaryPositions } from "@/features/D3/utils/positionGraphElements";
import { useGestures } from "@/features/Graph/hooks/useGestures";
import getNodeConnections, {
  IConnectionsAndNodes,
} from "@/features/Graph/utils/getNodeConnections";
import {
  setLinks,
  setNodes,
  setSecondary,
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

  // get primary connections for rootNode (user)
  const rootConnections =
    rootNode && connections && people
      ? getNodeConnections(rootNode, connections, people, rootNode)
      : null;

  // get primary connections for each primary connection of root
  const secondaryConnections =
    connections && people && rootConnections && rootNode
      ? rootConnections.nodeIds.reduce((acc, nodeId) => {
          if (nodeId !== rootNode?.id) {
            const node = rootConnections.nodes[nodeId];
            acc[nodeId] = getNodeConnections(
              node,
              connections,
              people,
              rootNode,
            );
          }
          return acc;
        }, {} as { [nodeId: number]: IConnectionsAndNodes })
      : null;

  useEffect(() => {
    if (!rootConnections) {
      return;
    }

    if (!dataLoaded && people && connections && rootNode) {
      const { nodes, links } = calcPrimaryPositions(
        Object.values(rootConnections.nodes),
        Object.values(rootConnections.connections),
        windowSize,
        scale,
      );

      dispatch(setNodes([...nodes]));
      dispatch(setLinks(links as ILink[]));
      setDataLoaded(true);
    }

    if (secondaryConnections) {
      dispatch(setSecondary(secondaryConnections));
    }
  }, [
    dataLoaded,
    people,
    windowSize,
    connections,
    dispatch,
    rootConnections,
    rootNode,
    scale,
    secondaryConnections,
  ]);

  return dataLoaded;
};
