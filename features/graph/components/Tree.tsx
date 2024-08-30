import { View } from "react-native";

import type { Node } from "@/lib/utils/newTreeGraphStrategy";

import TreeNode from "./TreeNode";

interface Props {
  descendants: d3.HierarchyPointNode<Node>[];
  links: {
    source: d3.HierarchyPointNode<Node> | null;
    target: d3.HierarchyPointNode<Node>;
  }[];
}

export default function Tree({ descendants, links }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      {descendants.map((node) => (
        <TreeNode key={node.data.name} node={node} />
      ))}
    </View>
  );
}
