import {
  PositionedGroup,
  PositionedLink,
  PositionedNode,
} from "@/lib/types/graph";

import GroupSvg from "./GroupSvg";
import LinkSvg from "./LinkSvg";
import NodeSvg from "./NodeSvg";

interface SVGsWrapperProps {
  data: {
    groups: PositionedGroup[];
    nodes: PositionedNode[];
    links: PositionedLink[];
  };
}

export default function SvgElements({ data }: SVGsWrapperProps) {
  const { groups, nodes, links } = data;

  return (
    <>
      {links.map((link) => {
        return <LinkSvg key={link.id} link={link} />;
      })}
      {groups.map((group) => {
        return <GroupSvg key={group.id} group={group} />;
      })}
      {nodes.map((node) => {
        return <NodeSvg key={node.id} node={node} />;
      })}
    </>
  );
}
