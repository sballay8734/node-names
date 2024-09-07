import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import NewPressableNode from "./NewPressableNode";

export default function PressableElements() {
  const allNodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );

  if (!allNodeIds || allNodeIds.length === 0) return null;

  return (
    <>
      {allNodeIds.map((id) => (
        <NewPressableNode key={id} node_id={id} />
      ))}
    </>
  );
}
