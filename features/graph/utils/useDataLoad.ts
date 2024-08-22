import { useEffect, useState } from "react";

import { useAppDispatch } from "@/hooks/reduxHooks";
import useDbData from "@/hooks/useDbData";

import { setActiveRootNode } from "../redux/graphManagement";

// REMOVE: Temporary until you add auth
const tempRootId = 1;

export function useDataLoad() {
  const dispatch = useAppDispatch();
  const [rootNodeId, setRootNodeId] = useState<number>(tempRootId);
  const { people, connections, groups, isLoading, dataFetched } = useDbData();

  useEffect(() => {
    if (dataFetched && people && connections && groups) {
      const initialRootNode = people.find((p) => p.id === rootNodeId);
      if (initialRootNode) {
        dispatch(setActiveRootNode(initialRootNode));
      }
    }
  }, [dataFetched, people, connections, groups, rootNodeId, dispatch]);

  const updateRootId = (newRootId: number) => {
    const newRootNode = people?.find((p) => p.id === newRootId);
    if (newRootNode) {
      setRootNodeId(newRootNode.id);
      dispatch(setActiveRootNode(newRootNode));
    }
  };

  return {
    isLoading,
    updateRootId,
    people,
    connections,
    rootNodeId,
  };
}
