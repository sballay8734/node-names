import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import MasterPressableNode from "./Nodes/MasterPressableNode";

export default function PressableElements() {
  const allNodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );

  const renderedPressableNodes = allNodeIds.map((id) => {
    return <MasterPressableNode id={id} key={id} length={allNodeIds.length} />;
  });

  return <>{renderedPressableNodes}</>;
}

// selectors
