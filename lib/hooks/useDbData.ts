import { QueryError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { WindowSize } from "@/lib/types/misc";
import { supabase } from "@/supabase";

import { useAppDispatch } from "../../store/reduxHooks";
import { Tables } from "../types/database";
import { setInitialNodePositions } from "../utils/setInitialNodePostions";

export default function useDbData(windowSize: WindowSize) {
  const dispatch = useAppDispatch();
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);
  const [groups, setGroups] = useState<Tables<"groups">[] | null>(null);
  const [error, setError] = useState<QueryError | null>(null);

  // temporary to handle unecessary refetching until you add RTK
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  useEffect(() => {
    if (dataFetched) return;

    setError(null);
    setDataIsLoading(true);
    async function fetchData() {
      try {
        const [nodesResult, edgesResult, groupsResult] = await Promise.all([
          supabase.from("nodes").select(),
          supabase.from("edges").select(),
          supabase.from("groups").select(),
        ]);

        if (nodesResult.error) throw nodesResult.error;
        if (edgesResult.error) throw edgesResult.error;
        if (groupsResult.error) throw groupsResult.error;

        // !TODO: RUN D3 INITIAL POSITIONING LOGIC HERE (because nodes and edges are arrays BEFORE they go to redux)
        const { positionedNodes, positionedEdges } = setInitialNodePositions(
          nodesResult.data,
          edgesResult.data,
          windowSize,
        );

        dispatch(
          setInitialState({
            nodes: positionedNodes,
            edges: positionedEdges,
          }),
        );

        setGroups(groupsResult.data);
        setDataFetched(true);
      } catch (error) {
        setError(error as QueryError);
      } finally {
        setDataIsLoading(false);
      }
    }

    fetchData();
  }, [dataFetched, dispatch, windowSize]);

  return {
    dataIsLoading,
    error,
  };
}
