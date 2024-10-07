import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import RenderPressableNode from "./Nodes/RenderPressableNode";

export default function PressableElements() {
  const allNodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );
  const rootGroupIds = useAppSelector(
    (state: RootState) => state.graphData.rootGroups.allIds,
  );

  console.log(rootGroupIds);

  if (!allNodeIds || allNodeIds.length === 0) return null;

  return (
    <>
      {allNodeIds.map((id) => (
        <RenderPressableNode key={id} node_id={id} />
      ))}
    </>
  );
}
