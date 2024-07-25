import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  setLinks,
  setNodes,
} from "@/features/manageSelections/redux/manageSelections";
import useDbData from "@/hooks/useDbData";
import useWindowSize from "@/hooks/useWindowSize";
import getPrimaryConnections from "@/utils/getPrimaryConnections";
import {
  calculatePositions,
  FinalizedLink,
} from "@/utils/positionGraphElements";

export const useDataLoad = () => {
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { people, connections } = useDbData();

  useEffect(() => {
    if (!dataLoaded && people && connections) {
      const { nodes, links } = calculatePositions(
        people,
        connections,
        windowSize,
      );
      // !TODO: WORKING HERE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

      const rootNode = nodes.find((n) => n.isRoot === true);
      const primaryConnections =
        rootNode && getPrimaryConnections(rootNode, connections);

      console.log("PRIMARY:", primaryConnections);

      // !TODO: WORKING HERE ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

      dispatch(setNodes([...nodes]));
      dispatch(setLinks(links as FinalizedLink[]));
      setDataLoaded(true);
    }
  }, [dataLoaded, people, windowSize, connections, dispatch]);

  return dataLoaded;
};
