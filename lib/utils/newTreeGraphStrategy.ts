import * as d3 from "d3";

import { WindowSize } from "../types/misc";

export type Node = {
  name: string; // or Id
  groupId: number | null; // just use same group as parent if set to null
  links: Node[];
  relationshipType:
    | "spouse"
    | "other"
    | "parent_child"
    | "child_parent"
    | "sibling"
    | null; // null for root
};

export const testData: Node = {
  name: "John Doe",
  groupId: null,
  relationshipType: null,
  links: [
    {
      name: "Jane Doe",
      groupId: 1,
      relationshipType: "spouse",
      links: [
        {
          name: "Alice Doe",
          groupId: 1,
          relationshipType: "parent_child",
          links: [],
        },
        {
          name: "Bob Doe",
          groupId: 1,
          relationshipType: "parent_child",
          links: [],
        },
      ],
    },
    {
      name: "Mary Johnson",
      groupId: 2,
      relationshipType: "sibling",
      links: [
        {
          name: "Steve Johnson",
          groupId: 2,
          relationshipType: "spouse",
          links: [
            {
              name: "Tom Johnson",
              groupId: 2,
              relationshipType: "parent_child",
              links: [],
            },
            {
              name: "Sue Johnson",
              groupId: 2,
              relationshipType: "parent_child",
              links: [],
            },
          ],
        },
      ],
    },
    {
      name: "Robert Smith",
      groupId: 3,
      relationshipType: "other",
      links: [
        {
          name: "Linda Smith",
          groupId: 3,
          relationshipType: "spouse",
          links: [
            {
              name: "Emily Smith",
              groupId: 3,
              relationshipType: "parent_child",
              links: [],
            },
            {
              name: "Kevin Smith",
              groupId: 3,
              relationshipType: "parent_child",
              links: [],
            },
          ],
        },
      ],
    },
  ],
};

export function createTree(data: Node, windowSize: WindowSize) {
  // Specify the chart’s dimensions.
  const width = windowSize.width;
  const height = windowSize.height;
  const cx = width * 0.5; // adjust as needed to fit
  const cy = height * 0.59; // adjust as needed to fit
  const radius = Math.min(width, height) / 2 - 30;

  // create a radial tree layout. The layout’s first dimension (x) is the angle, while the second (y) is the radius.
  const tree = d3
    .tree<Node>()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

  // sort the tree and apply the layout.
  const root = tree(
    d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name)),
  );

  // console.log("links:", links);
  // console.log("nodes:", nodes);

  let x0 = Infinity;
  let x1 = -x0;
  tree(root).each((d: d3.HierarchyPointNode<Node>) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });
  console.log(root);

  return root;
}

const res = [
  {
    data: {
      groupId: null,
      links: [Array],
      name: "John Doe",
      relationshipType: null,
    },
    depth: 0,
    height: 0,
    parent: null,
    x: 3.141592653589793,
    y: 0,
  },
];
