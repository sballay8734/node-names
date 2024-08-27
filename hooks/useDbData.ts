import { QueryError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "@/supabase";
import { Tables } from "@/types/newArchTypes";

export default function useDbData() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vertices, setVertices] = useState<Tables<"vertices">[] | null>(null);
  const [edges, setEdges] = useState<Tables<"edges">[] | null>(null);
  const [groups, setGroups] = useState<Tables<"groups">[] | null>(null);
  const [error, setError] = useState<QueryError | null>(null);

  // temporary to handle unecessary refetching until you add RTK
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  useEffect(() => {
    if (dataFetched) return;

    setError(null);
    setIsLoading(true);
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

        console.log(verticesResult.data);
        console.log(edgesResult.data);

        setVertices(verticesResult.data);
        setEdges(edgesResult.data);
        setGroups(groupsResult.data);
        setDataFetched(true);
      } catch (error) {
        setError(error as QueryError);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dataFetched]);

  return {
    isLoading,
    vertices,
    edges,
    groups,
    error,
    dataFetched,
  };
}
