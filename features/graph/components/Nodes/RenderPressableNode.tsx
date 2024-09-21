import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import MasterPressableNode from "./MasterPressableNode";

interface NewNodeProps {
  node_id: number;
}

export default function NewPressableNode({ node_id }: NewNodeProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[node_id],
  );

  if (!node) return null;

  return <MasterPressableNode key={node_id} node={node} />;
}
