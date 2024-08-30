import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

type Node = {
  name: string;
  groupId: number | null;
  links: Node[];
  relationshipType:
    | "spouse"
    | "other"
    | "parent_child"
    | "child_parent"
    | "sibling"
    | null;
  x?: number;
  y?: number;
};

interface TreeNodeProps {
  node: Node;
  isSelected: boolean;
  onSelect: (node: Node) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const tap = Gesture.Tap()
    .onEnd(() => {
      onSelect(node);
    })
    .runOnJS(true);

  // console.log(node.name, node.x);
  // console.log(node.name, node.y);

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.nodeContainer,
          {
            left: node.x,
            top: node.y,
            backgroundColor: isSelected ? "#c2ffef" : "#f0f0f0",
          },
        ]}
      >
        <Animated.Text style={styles.nodeText}>{node.name}</Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
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
});
