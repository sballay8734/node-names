import { View, StyleSheet } from "react-native";
import Svg from "react-native-svg";

import type { Node } from "@/lib/utils/newTreeGraphStrategy";

import TreeLink from "./TreeLink";
import TreeNode from "./TreeNode";

interface Props {
  descendants: d3.HierarchyPointNode<Node>[];
  links: d3.HierarchyPointLink<Node>[];
}

export default function Tree({ descendants, links }: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "red",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg style={StyleSheet.absoluteFill}>
        {links.map((link, i) => (
          <TreeLink key={i} link={link} />
        ))}
      </Svg>
      {descendants.map((node) => (
        <TreeNode key={node.data.name} node={node} />
      ))}
    </View>
  );
}
