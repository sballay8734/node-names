import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import MasterSvgNode from "./MasterSvgNode";

interface NewSvgProps {
  id: number;
}

export default function RenderSvgNode({ id }: NewSvgProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[id],
  );

  if (!node) return null;

  return <MasterSvgNode key={node.id} node={node} />;
}
