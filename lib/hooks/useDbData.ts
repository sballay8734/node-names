import { QueryError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { setInitialState } from "@/features/Graph/redux/graphSlice";
import { WindowSize } from "@/lib/types/misc";
import { supabase } from "@/supabase";

import { useAppDispatch } from "../../store/reduxHooks";
import { Tables } from "../types/database";
import { setInitialVertexPositions } from "../utils/setInitialVertexPostions";

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
        const [verticesResult, edgesResult, groupsResult] = await Promise.all([
          supabase.from("vertices").select(),
          supabase.from("edges").select(),
          supabase.from("groups").select(),
        ]);

        if (verticesResult.error) throw verticesResult.error;
        if (edgesResult.error) throw edgesResult.error;
        if (groupsResult.error) throw groupsResult.error;

        // !TODO: RUN D3 INITIAL POSITIONING LOGIC HERE (because vertices and edges are arrays BEFORE they go to redux)
        const { positionedVertices, positionedEdges } =
          setInitialVertexPositions(
            verticesResult.data,
            edgesResult.data,
            windowSize,
          );

        dispatch(
          setInitialState({
            vertices: positionedVertices,
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
