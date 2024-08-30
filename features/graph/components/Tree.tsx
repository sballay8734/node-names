import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { createTree, Node } from "@/lib/utils/newTreeGraphStrategy";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { TreeNode } from "./TreeNode";

const Tree: React.FC<{ data: Node }> = ({ data }) => {
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleSelect = (node: Node) => {
    setSelectedNode(node);
  };

  const renderLinks = (root: d3.HierarchyPointNode<Node>) => {
    return root.links().map((link, index) => {
      const { source, target } = link;

      return (
        <View
          key={index}
          style={[
            styles.link,
            {
              left: source.x,
              top: source.y,
              width: Math.abs(target.x - source.x),
              height: Math.abs(target.y - source.y),
              transform: [{ translateX: source.x }, { translateY: source.y }],
            },
          ]}
        />
      );
    });
  };

  const renderNodes = (root: d3.HierarchyPointNode<Node>) => {
    return root
      .descendants()
      .map((node) => (
        <TreeNode
          key={node.data.name}
          node={node.data}
          isSelected={selectedNode?.name === node.data.name}
          onSelect={handleSelect}
        />
      ));
  };

  const root = createTree(data, windowSize);

  return (
    <View style={styles.treeContainer}>
      {renderLinks(root)}
      {renderNodes(root)}
    </View>
  );
};

const styles = StyleSheet.create({
  treeContainer: {
    flex: 1,
    position: "relative",
  },
  nodeContainer: {
    position: "absolute",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  nodeText: {
    fontSize: 16,
  },
  link: {
    position: "absolute",
    backgroundColor: "#ccc",
    height: 1,
  },
});

export default Tree;
