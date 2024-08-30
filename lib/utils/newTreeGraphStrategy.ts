import * as d3 from "d3";

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
  ],
};

export function createTree(data: Node, windowSize: WindowSize) {
  // Specify the chart’s dimensions.
  const width = windowSize.width;
  const height = windowSize.height;
  const cx = width * 0.5; // adjust as needed to fit
  const cy = height * 0.59; // adjust as needed to fit
  const radius = Math.min(width, height) / 2 - 30;

  // Create a radial tree layout. The layout’s first dimension (x) is the angle, while the second (y) is the radius.
  const tree = d3
    .tree<Node>()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

  // Sort the tree and apply the layout.
  const root = tree(
    d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name)),
  );

  function generateLinks(descendants: d3.HierarchyPointNode<Node>[]) {
    return descendants.slice(1).map((d) => ({
      source: d.parent,
      target: d,
    }));
  }

  // Usage:
  const descendants = root.descendants();
  const links = generateLinks(descendants);

  // console.log("LINKS:", links);
  // console.log("DESCENDANTS:", descendants);

  return {
    descendants,
    links,
  };
}

// const DESCENDANTS = [
//   {
//     children: [[Node], [Node], [Node]],
//     data: {
//       children: [Array],
//       groupId: null,
//       name: "John Doe",
//       relationshipType: null,
//     },
//     depth: 0,
//     height: 3,
//     parent: null,
//     x: 3.2129924866259247,
//     y: 0,
//   },
//   {
//     children: [[Node], [Node]],
//     data: {
//       children: [Array],
//       groupId: 1,
//       name: "Jane Doe",
//       relationshipType: "spouse",
//     },
//     depth: 1,
//     height: 1,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 0,
//       height: 3,
//       parent: null,
//       x: 3.2129924866259247,
//       y: 0,
//     },
//     x: 1.2851969946503699,
//     y: 55.5,
//   },
//   {
//     children: [[Node]],
//     data: {
//       children: [Array],
//       groupId: 2,
//       name: "Mary Johnson",
//       relationshipType: "sibling",
//     },
//     depth: 1,
//     height: 2,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 0,
//       height: 3,
//       parent: null,
//       x: 3.2129924866259247,
//       y: 0,
//     },
//     x: 3.4271919857343196,
//     y: 55.5,
//   },
//   {
//     children: [[Node]],
//     data: {
//       children: [Array],
//       groupId: 3,
//       name: "Robert Smith",
//       relationshipType: "other",
//     },
//     depth: 1,
//     height: 2,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 0,
//       height: 3,
//       parent: null,
//       x: 3.2129924866259247,
//       y: 0,
//     },
//     x: 5.140787978601479,
//     y: 55.5,
//   },
//   {
//     data: {
//       children: [Array],
//       groupId: 1,
//       name: "Alice Doe",
//       relationshipType: "parent_child",
//     },
//     depth: 2,
//     height: 0,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 1,
//       parent: [Node],
//       x: 1.2851969946503699,
//       y: 55.5,
//     },
//     x: 0.8567979964335799,
//     y: 111,
//   },
//   {
//     data: {
//       children: [Array],
//       groupId: 1,
//       name: "Bob Doe",
//       relationshipType: "parent_child",
//     },
//     depth: 2,
//     height: 0,
//     parent: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 1,
//       parent: [Node],
//       x: 1.2851969946503699,
//       y: 55.5,
//     },
//     x: 1.7135959928671598,
//     y: 111,
//   },
//   {
//     children: [[Node], [Node]],
//     data: {
//       children: [Array],
//       groupId: 2,
//       name: "Steve Johnson",
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
//       x: 3.4271919857343196,
//       y: 55.5,
//     },
//     x: 3.4271919857343196,
//     y: 111,
//   },
//   {
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
//       x: 5.140787978601479,
//       y: 55.5,
//     },
//     x: 5.140787978601479,
//     y: 111,
//   },
//   {
//     data: {
//       children: [Array],
//       groupId: 2,
//       name: "Sue Johnson",
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
//       x: 3.4271919857343196,
//       y: 111,
//     },
//     x: 3.141592653589793,
//     y: 166.5,
//   },
//   {
//     data: {
//       children: [Array],
//       groupId: 2,
//       name: "Tom Johnson",
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
//       x: 3.4271919857343196,
//       y: 111,
//     },
//     x: 3.7127913178788465,
//     y: 166.5,
//   },
//   {
//     data: {
//       children: [Array],
//       groupId: 3,
//       name: "Emily Smith",
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
//       x: 5.140787978601479,
//       y: 111,
//     },
//     x: 4.855188646456953,
//     y: 166.5,
//   },
//   {
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
//       x: 5.140787978601479,
//       y: 111,
//     },
//     x: 5.426387310746007,
//     y: 166.5,
//   },
// ];

// const LINKS = [
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 0,
//       height: 3,
//       parent: null,
//       x: 3.2129924866259247,
//       y: 0,
//     },
//     target: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 1,
//       parent: [Node],
//       x: 1.2851969946503699,
//       y: 55.5,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 0,
//       height: 3,
//       parent: null,
//       x: 3.2129924866259247,
//       y: 0,
//     },
//     target: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 2,
//       parent: [Node],
//       x: 3.4271919857343196,
//       y: 55.5,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 0,
//       height: 3,
//       parent: null,
//       x: 3.2129924866259247,
//       y: 0,
//     },
//     target: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 2,
//       parent: [Node],
//       x: 5.140787978601479,
//       y: 55.5,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 1,
//       parent: [Node],
//       x: 1.2851969946503699,
//       y: 55.5,
//     },
//     target: {
//       data: [Object],
//       depth: 2,
//       height: 0,
//       parent: [Node],
//       x: 0.8567979964335799,
//       y: 111,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 1,
//       parent: [Node],
//       x: 1.2851969946503699,
//       y: 55.5,
//     },
//     target: {
//       data: [Object],
//       depth: 2,
//       height: 0,
//       parent: [Node],
//       x: 1.7135959928671598,
//       y: 111,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 2,
//       parent: [Node],
//       x: 3.4271919857343196,
//       y: 55.5,
//     },
//     target: {
//       children: [Array],
//       data: [Object],
//       depth: 2,
//       height: 1,
//       parent: [Node],
//       x: 3.4271919857343196,
//       y: 111,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 1,
//       height: 2,
//       parent: [Node],
//       x: 5.140787978601479,
//       y: 55.5,
//     },
//     target: {
//       children: [Array],
//       data: [Object],
//       depth: 2,
//       height: 1,
//       parent: [Node],
//       x: 5.140787978601479,
//       y: 111,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 2,
//       height: 1,
//       parent: [Node],
//       x: 3.4271919857343196,
//       y: 111,
//     },
//     target: {
//       data: [Object],
//       depth: 3,
//       height: 0,
//       parent: [Node],
//       x: 3.141592653589793,
//       y: 166.5,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 2,
//       height: 1,
//       parent: [Node],
//       x: 3.4271919857343196,
//       y: 111,
//     },
//     target: {
//       data: [Object],
//       depth: 3,
//       height: 0,
//       parent: [Node],
//       x: 3.7127913178788465,
//       y: 166.5,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 2,
//       height: 1,
//       parent: [Node],
//       x: 5.140787978601479,
//       y: 111,
//     },
//     target: {
//       data: [Object],
//       depth: 3,
//       height: 0,
//       parent: [Node],
//       x: 4.855188646456953,
//       y: 166.5,
//     },
//   },
//   {
//     source: {
//       children: [Array],
//       data: [Object],
//       depth: 2,
//       height: 1,
//       parent: [Node],
//       x: 5.140787978601479,
//       y: 111,
//     },
//     target: {
//       data: [Object],
//       depth: 3,
//       height: 0,
//       parent: [Node],
//       x: 5.426387310746007,
//       y: 166.5,
//     },
//   },
// ];
