import { QueryError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "@/supabase";
import { Tables } from "@/types/dbTypes";

export default function useDbData() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [people, setPeople] = useState<Tables<"people">[] | null>(null);
  const [connections, setConnections] = useState<
    Tables<"connections">[] | null
  >(null);
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
        const [peopleResult, connectionsResult, groupsResult] =
          await Promise.all([
            supabase.from("people").select(),
            supabase.from("connections").select(),
            supabase.from("groups").select(),
          ]);

        if (peopleResult.error) throw peopleResult.error;
        if (connectionsResult.error) throw connectionsResult.error;
        if (groupsResult.error) throw groupsResult.error;

        setPeople(peopleResult.data);
        setConnections(connectionsResult.data);
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
    people,
    connections,
    groups,
    error,
    dataFetched,
  };
}
