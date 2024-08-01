import { useEffect, useState } from "react";

import { ILink } from "@/features/D3/types/d3Types";
import { calcPrimaryPositions } from "@/features/D3/utils/positionGraphElements";
import { useGestures } from "@/features/Graph/hooks/useGestures";
import {
  setLinks,
  setNodes,
} from "@/features/SelectionManagement/redux/manageSelections";
import useDbData from "@/hooks/useDbData";
import useWindowSize from "@/hooks/useWindowSize";

import { useAppDispatch } from "./reduxHooks";

export const useDataLoad = () => {
  const dispatch = useAppDispatch();
  const windowSize = useWindowSize();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const { scale } = useGestures();

  const { people, connections } = useDbData();

  useEffect(() => {
    if (!dataLoaded && people && connections) {
      const { nodes, links } = calcPrimaryPositions(
        people,
        connections,
        windowSize,
        scale,
      );

      dispatch(setNodes([...nodes]));
      dispatch(setLinks(links as ILink[]));
      setDataLoaded(true);
    }
  }, [dataLoaded, people, windowSize, connections, dispatch]);

  return dataLoaded;
};
