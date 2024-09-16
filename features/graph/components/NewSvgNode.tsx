import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import GroupNodeSvg from "./SvgGroupNode";
import SvgNode from "./SvgNode";

interface NewSvgProps {
  id: number;
}

export default function NewSvgNode({ id }: NewSvgProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[id],
  );

  if (!node) return null;

  if (node.type === "node") {
    return <SvgNode key={node.id} node={node} />;
  } else if (node.type === "group") {
    return <GroupNodeSvg key={node.id} node={node} />;
  }
}
