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
  ],
};

export const TREE_NODE_DIM = 60;
export const TREE_NODE_RADIUS = TREE_NODE_DIM / 2;

export function createTree(data: Node, windowSize: WindowSize) {
  // Specify the chart’s dimensions.
  const width = windowSize.width;
  const height = windowSize.height;
  const cx = windowSize.windowCenterX - TREE_NODE_RADIUS; // Center X
  const cy = windowSize.windowCenterY - TREE_NODE_RADIUS; // Center Y
  const radius = Math.min(width, height) / 2 - 30;

  // Create a radial tree layout. The layout’s first dimension (x) is the angle, while the second (y) is the radius.
  const tree = d3
    .tree<Node>()
    .size([360, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

  // Sort the tree and apply the layout.
  const root = tree(
    d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name)),
  );

  root.x = cx;
  root.y = cy;

  const descendants = root.descendants();
  const links = root.links();

  // const linkGenerator = d3
  //   .linkRadial()
  //   .angle((d) => d.x)
  //   .radius((d) => d.y);

  // const radialLinks = links.map((link) => ({
  //   source: [link.source.x, link.source.y],
  //   target: [link.target.x, link.target.y],
  //   path: linkGenerator(link),
  // }));

  return {
    descendants,
    links,
  };
}

const test = [
  {
    path: "M0,0C-1.98,27.679,26.626,-7.818,53.252,-15.636",
    source: [3.2129924866259247, 0],
    target: [1.2851969946503699, 55.5],
  },
  {
    path: "M0,0C-1.98,27.679,-7.818,26.626,-15.636,53.252",
    source: [3.2129924866259247, 0],
    target: [3.4271919857343196, 55.5],
  },
  {
    path: "M0,0C-1.98,27.679,-25.242,-11.528,-50.485,-23.056",
    source: [3.2129924866259247, 0],
    target: [5.140787978601479, 55.5],
  },
  {
    path: "M53.252,-15.636C79.878,-23.454,62.916,-54.517,83.888,-72.69",
    source: [1.2851969946503699, 55.5],
    target: [0.8567979964335799, 111],
  },
  {
    path: "M53.252,-15.636C79.878,-23.454,82.403,11.848,109.87,15.797",
    source: [1.2851969946503699, 55.5],
    target: [1.7135959928671598, 111],
  },
  {
    path: "M-15.636,53.252C-23.454,79.878,-23.454,79.878,-31.272,106.504",
    source: [3.4271919857343196, 55.5],
    target: [3.4271919857343196, 111],
  },
  {
    path: "M-50.485,-23.056C-75.727,-34.583,-75.727,-34.583,-100.969,-46.111",
    source: [5.140787978601479, 55.5],
    target: [5.140787978601479, 111],
  },
  {
    path: "M-31.272,106.504C-39.09,133.13,0,138.75,0,166.5",
    source: [3.4271919857343196, 111],
    target: [3.141592653589793, 166.5],
  },
  {
    path: "M-31.272,106.504C-39.09,133.13,-75.014,116.724,-90.017,140.069",
    source: [3.4271919857343196, 111],
    target: [3.7127913178788465, 166.5],
  },
  {
    path: "M-100.969,-46.111C-126.211,-57.639,-137.338,-19.746,-164.805,-23.695",
    source: [5.140787978601479, 111],
    target: [4.855188646456953, 166.5],
  },
  {
    path: "M-100.969,-46.111C-126.211,-57.639,-104.86,-90.862,-125.832,-109.034",
    source: [5.140787978601479, 111],
    target: [5.426387310746007, 166.5],
  },
];
