import { GestureContextType } from "@/lib/context/gestures";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import LinkSvg from "./Links/LinkSvg";
import MasterSvgNode from "./Nodes/MasterSvgNode";

interface Props {
  gestures: GestureContextType;
}

export default function SvgElements({ gestures }: Props) {
  const linkIds = useAppSelector(
    (state: RootState) => state.graphData.links.allIds,
  );
  const rootGroupIds = useAppSelector(
    (state: RootState) => state.graphData.rootGroups.allIds,
  );
  const nodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );
  const nodes = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId,
  );

  return (
    <>
      {linkIds.map((id) => {
        return <LinkSvg gestures={gestures} key={id} link_id={id} />;
        // return <LinkSvg key={id} id={id} />;
      })}
      {rootGroupIds.map((id) => {
        const node = nodes[id];
        return (
          <MasterSvgNode
            gestures={gestures}
            key={id}
            id={id} //
            newestX={node.x}
            newestY={node.y}
            totalIds={nodeIds.length}
          />
        );
      })}
      {nodeIds.map((id) => {
        const node = nodes[id];
        return (
          <MasterSvgNode
            gestures={gestures}
            key={id}
            id={id}
            newestX={node.x}
            newestY={node.y}
            totalIds={nodeIds.length}
          />
        );
      })}
    </>
  );
}
