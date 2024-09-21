import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import LinkSvg from "./LinkSvg";
import RenderSvgNode from "./Nodes/RenderSvgNode";

export default function SvgElements() {
  const linkIds = useAppSelector(
    (state: RootState) => state.graphData.links.allIds,
  );
  // const groupIds = useAppSelector(
  //   (state: RootState) => state.graphData.groups.allIds,
  // );
  const nodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );

  return (
    <>
      {linkIds.map((id) => {
        return <LinkSvg key={id} id={id} />;
      })}
      {/* {groupIds.map((id) => {
        return <GroupSvg key={id} id={id} />;
      })} */}
      {nodeIds.map((id) => {
        return <RenderSvgNode key={id} id={id} />;
      })}
    </>
  );
}
