import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import GroupPath from "./GroupPath";
import NewLinkSvg from "./Links/NewLinkSvg";
import LinkSvg from "./LinkSvg";
import RenderSvgNode from "./Nodes/RenderSvgNode";

export default function SvgElements() {
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
        return <GroupPath key={id} id={id} />;
      })}
      {nodeIds.map((id) => {
        return <RenderSvgNode key={id} id={id} />;
      })}
    </>
  );
}
