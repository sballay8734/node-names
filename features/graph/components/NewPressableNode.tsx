import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import PressableGroupNode from "./PressableGroupNode";
import PressableNode from "./PressableNode";

interface NewNodeProps {
  node_id: number;
}

export default function NewPressableNode({ node_id }: NewNodeProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[node_id],
  );

  if (!node) return null;

  if (node.type === "node") {
    return <PressableNode key={node_id} node={node} />;
  } else if (node.type === "group") {
    return <PressableGroupNode key={node_id} node={node} />;
  }
}
