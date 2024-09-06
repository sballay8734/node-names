import {
  PositionedGroup,
  PositionedLink,
  PositionedPerson,
} from "@/lib/utils/positionGraphEls";

import NewGroup from "./GroupSvg";
import NewLink from "./LinkSvg";
import NewPerson from "./NodeSvg";

interface SVGsWrapperProps {
  data: {
    groups: PositionedGroup[];
    people: PositionedPerson[];
    links: PositionedLink[];
  };
}

export default function SvgElements({ data }: SVGsWrapperProps) {
  const { groups, people, links } = data;

  return (
    <>
      {links.map((link) => {
        return <NewLink key={link.id} link={link} />;
      })}
      {groups.map((group) => {
        return <NewGroup key={group.id} group={group} />;
      })}
      {people.map((person) => {
        return <NewPerson key={person.id} person={person} />;
      })}
    </>
  );
}
