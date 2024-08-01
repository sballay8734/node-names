import { useEffect, useState } from "react";

import { useAppSelector } from "@/hooks/reduxHooks";
import useDbData from "@/hooks/useDbData";
import { RootState } from "@/store/store";

// REMOVE: Temporary until you add auth
const tempRootId = 1;

export function useNewDataLoad() {
  const activeRootNode = useAppSelector(
    (state: RootState) => state.manageGraph.activeRootNode,
  );
  const [rootNodeId, setRootNodeId] = useState<number>(tempRootId);
  const { people, connections, groups, isLoading, dataFetched } = useDbData();

  // TODO: vv This is currently searching all people in DB (not right)
  const rootNode = people?.find((p) => p.id === rootNodeId);

  useEffect(() => {
    if (dataFetched && people && connections && groups) {
      // initial render
      if (rootNode) {
        console.log("Current Root:", rootNode);
      } else if (people.length > 0) {
        const newRootId = people[0].id;
        setRootNodeId(newRootId);
        console.log("Setting new root:", newRootId);
      }
    }
  }, [dataFetched, people, connections, groups, rootNode]);

  const updateRootId = (newRootId: number) => {
    setRootNodeId(newRootId);
  };

  return { rootNode, isLoading, updateRootId };
}

// !TODO: You'll actually have to find the person whose ID matches the userId
// !TODO: Double check this logic
