import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import useDbData from "@/hooks/useDbData";
import { RootState } from "@/store/store";
import { Tables } from "@/types/dbTypes";

import { setState } from "../redux/graphDataManagement";
import { setActiveRootNode, setUserNode } from "../redux/graphManagement";

// REMOVE: Temporary until you add auth
const userId = 1;

export function useDataLoad() {
  const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const [rootNodeId, setRootNodeId] = useState<number>(userId);
  const { vertices, edges, groups, isLoading, dataFetched } = useDbData();

  const [people, setPeople] = useState<Tables<"people">[] | null>(null);

  useEffect(() => {
    if (dataFetched && vertices && edges && groups && !isLoading) {
      // console.log("VERTICES:", vertices);
      // console.log("EDGES:", edges);
      dispatch(setState({ vertices, edges, groups }));

      let initialRootNode = updatedPeople.find((p) => p.id === rootNodeId);

      // set position of root
      if (initialRootNode) {
        const updatedNode = {
          ...initialRootNode,
          fx: windowSize.width / 2,
          fy: windowSize.height,
          isShown: true,
          is_current_root: true,
        };

        dispatch(setActiveRootNode(updatedNode));
        dispatch(setUserNode(updatedNode));
      }
    }
  }, [
    dataFetched,
    vertices,
    edges,
    groups,
    rootNodeId,
    dispatch,
    windowSize.width,
    windowSize.height,
    isLoading,
  ]);

  return {
    isLoading,
    people,
    edges,
    rootNodeId,
  };
}
