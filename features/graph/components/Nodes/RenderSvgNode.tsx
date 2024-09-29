import { GestureContextType } from "@/lib/context/gestures";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import MasterSvgNode from "./MasterSvgNode";

interface NewSvgProps {
  id: number;
  gestures: GestureContextType;
}

export default function RenderSvgNode({ id, gestures }: NewSvgProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[id],
  );

  if (!node) return null;

  return <MasterSvgNode gestures={gestures} key={node.id} node={node} />;
}
