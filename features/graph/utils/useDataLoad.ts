import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import useDbData from "@/hooks/useDbData";
import { RootState } from "@/store/store";
import { Tables } from "@/types/dbTypes";

import { setActiveRootNode, setUserNode } from "../redux/graphManagement";

// REMOVE: Temporary until you add auth
const userId = 1;

export function useDataLoad() {
  console.log(`[${new Date().toISOString()}] Rendering useDataLoad`);
  const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const [rootNodeId, setRootNodeId] = useState<number>(userId);
  const {
    people: initialPeople,
    connections,
    groups,
    isLoading,
    dataFetched,
  } = useDbData();
  const [people, setPeople] = useState<Tables<"people">[] | null>(null);

  useEffect(() => {
    if (dataFetched && initialPeople && connections && groups) {
      const updatedPeople = initialPeople.map((person) => {
        if (person.id === rootNodeId && !person.is_current_root) {
          return {
            ...person,
            is_current_root: true,
          };
        }
        return person;
      });

      setPeople(updatedPeople);

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
    initialPeople,
    connections,
    groups,
    rootNodeId,
    dispatch,
    windowSize.width,
    windowSize.height,
  ]);

  return {
    isLoading,
    people,
    connections,
    rootNodeId,
  };
}
