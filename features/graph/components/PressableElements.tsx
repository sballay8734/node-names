import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import NewNode from "./PressableNode";

export default function PressableElements() {
  const allNodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );

  if (!allNodeIds || allNodeIds.length === 0) return null;

  return (
    <>
      {allNodeIds.map((id) => (
        <NewNode key={id} node_id={id} />
      ))}
    </>
  );
}
