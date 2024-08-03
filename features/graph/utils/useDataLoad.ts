import { useEffect, useState } from "react";

import { PositionedNode } from "@/features/D3/types/d3Types";
import { useAppDispatch } from "@/hooks/reduxHooks";
import useDbData from "@/hooks/useDbData";

import { setActiveRootNode } from "../redux/graphManagement";

// REMOVE: Temporary until you add auth
const tempRootId = 1;

export function useDataLoad() {
  const dispatch = useAppDispatch();
  const [rootNodeId, setRootNodeId] = useState<number>(tempRootId);
  const { people, connections, groups, isLoading, dataFetched } = useDbData();

  // !TODO: vv This is currently searching all people in DB (not right)
  let newRootNode = people?.find((p) => p.id === rootNodeId);

  useEffect(() => {
    if (dataFetched && people && connections && groups) {
      // initial render
      if (newRootNode) {
        dispatch(setActiveRootNode(newRootNode as PositionedNode));
      }
    }
  }, [dataFetched, people, connections, groups, newRootNode, dispatch]);

  const updateRootId = (newRootId: number) => {
    setRootNodeId(newRootId);
  };

  return { newRootNode, isLoading, updateRootId, people, connections };
}

// !TODO: You'll actually have to find the person whose ID matches the userId
// !TODO: Double check this logic
