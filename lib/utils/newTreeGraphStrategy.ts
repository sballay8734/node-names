import * as d3 from "d3";
import { HierarchyPointNode } from "d3";

import { WindowSize } from "../types/misc";

export type Node = {
  name: string; // or Id
  groupId: number | null; // just use same group as parent if set to null
  children: Node[];
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
  children: [
    {
      name: "Jane Doe",
      groupId: 1,
      relationshipType: "spouse",
      children: [
        {
          name: "Alice Doe",
          groupId: 1,
          relationshipType: "parent_child",
          children: [],
        },
        {
          name: "Bob Doe",
          groupId: 1,
          relationshipType: "parent_child",
          children: [],
        },
      ],
    },
    {
      name: "Mary Johnson",
      groupId: 2,
      relationshipType: "sibling",
      children: [
        {
          name: "Steve Johnson",
          groupId: 2,
          relationshipType: "spouse",
          children: [
            {
              name: "Tom Johnson",
              groupId: 2,
              relationshipType: "parent_child",
              children: [],
            },
            {
              name: "Sue Johnson",
              groupId: 2,
              relationshipType: "parent_child",
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: "Robert Smith",
      groupId: 3,
      relationshipType: "other",
      children: [
        {
          name: "Linda Smith",
          groupId: 3,
          relationshipType: "spouse",
          children: [
            {
              name: "Emily Smith",
              groupId: 3,
              relationshipType: "parent_child",
              children: [],
            },
            {
              name: "Kevin Smith",
              groupId: 3,
              relationshipType: "parent_child",
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: "Chicago Bulls",
      groupId: 1,
      relationshipType: "spouse",
      children: [
        {
          name: "Los Angeles Lakers",
          groupId: 1,
          relationshipType: "parent_child",
          children: [],
        },
        {
          name: "Golden State Warriors",
          groupId: 1,
          relationshipType: "parent_child",
          children: [],
        },
      ],
    },
    {
      name: "New York Yankees",
      groupId: 2,
      relationshipType: "sibling",
      children: [
        {
          name: "Boston Red Sox",
          groupId: 2,
          relationshipType: "spouse",
          children: [
            {
              name: "Houston Astros",
              groupId: 2,
              relationshipType: "parent_child",
              children: [],
            },
            {
              name: "Chicago Cubs",
              groupId: 2,
              relationshipType: "parent_child",
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: "Dallas Cowboys",
      groupId: 3,
      relationshipType: "other",
      children: [
        {
          name: "San Francisco 49ers",
          groupId: 3,
          relationshipType: "spouse",
          children: [
            {
              name: "Miami Dolphins",
              groupId: 3,
              relationshipType: "parent_child",
              children: [],
            },
            {
              name: "Green Bay Packers",
              groupId: 3,
              relationshipType: "parent_child",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export const TREE_NODE_DIM = 100;
export const TREE_NODE_RADIUS = TREE_NODE_DIM / 2;

export function createTree(data: Node, windowSize: WindowSize) {
  // Specify the chart’s dimensions.
  const width = windowSize.width;
  const height = windowSize.height;
  const cx = windowSize.windowCenterX - TREE_NODE_RADIUS; // Center X
  const cy = windowSize.windowCenterY - TREE_NODE_RADIUS; // Center Y
  const radius = Math.min(width, height) / 2 + 300;

  // Create a radial tree layout. The layout’s first dimension (x) is the angle, while the second (y) is the radius.
  const tree = d3
    .tree<Node>()
    .size([360, radius])
    .separation((a, b) => (a.parent === b.parent ? 50 : 100));

  // Sort the tree and apply the layout.
  const root = tree(
    d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name)),
  );

  const descendants = root.descendants();
  const links = root.links();

  // TODO: Use this to handle grouping
  // const groupedNodes = root.descendants().map((n) => {
  //   if (n.data.groupId)...
  // })

  // const linkGenerator = d3
  //   .linkRadial()
  //   .angle((d) => d.x)
  //   .radius((d) => d.y);

  // const links = root.links().map((link) => ({
  //   source: [link.source.x, link.source.y],
  //   target: [link.target.x, link.target.y],
  //   path: linkGenerator(link),
  // }));

  return {
    descendants,
    links,
  };
}

// const testLink = {
//   source: {
//     children: [[Node], [Node]],
//     data: {
//       children: [Array],
//       groupId: 3,
//       name: "Linda Smith",
//       relationshipType: "spouse",
//     },
//     depth: 2,
//     height: 1,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 2,
//       parent: [Node],
//       x: 327.27272727272725,
//       y: 315.5,
//     },
//     x: 327.27272727272725,
//     y: 631,
//   },
//   target: {
//     data: {
//       children: [Array],
//       groupId: 3,
//       name: "Kevin Smith",
//       relationshipType: "parent_child",
//     },
//     depth: 3,
//     height: 0,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 2,
//       height: 1,
//       parent: [Node],
//       x: 327.27272727272725,
//       y: 631,
//     },
//     x: 338.1818181818182,
//     y: 946.5,
//   },
// };
