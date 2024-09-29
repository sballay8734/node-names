import { GestureContextType } from "@/lib/context/gestures";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import GroupPath from "./GroupPath";
import NewLinkSvg from "./Links/NewLinkSvg";
import RenderSvgNode from "./Nodes/RenderSvgNode";

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

  // console.log(linkIds);

  return (
    <>
      {linkIds.map((id) => {
        return <NewLinkSvg key={id} link_id={id} />;
        // return <LinkSvg key={id} id={id} />;
      })}
      {rootGroupIds.map((id) => {
        return <RenderSvgNode gestures={gestures} key={id} id={id} />;
      })}
      {/* {rootGroupIds.map((id) => {
        return <GroupPath key={id} id={id} />;
      })} */}
      {nodeIds.map((id) => {
        return <RenderSvgNode gestures={gestures} key={id} id={id} />;
      })}
    </>
  );
}
