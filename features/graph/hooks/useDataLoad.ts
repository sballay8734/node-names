import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  setLinks,
  setNodes,
} from "@/features/SelectionManagement/redux/manageSelections";
import useDbData from "@/hooks/useDbData";
import useWindowSize from "@/hooks/useWindowSize";
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

      dispatch(setNodes([...nodes]));
      dispatch(setLinks(links as FinalizedLink[]));
      setDataLoaded(true);
    }
  }, [dataLoaded, people, windowSize, connections, dispatch]);

  return dataLoaded;
};
