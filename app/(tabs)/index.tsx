import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Canvas, Text as SkiaText } from "@shopify/react-native-skia";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import testNodes from "../../data/mainMockData.json";
import useWindowSize from "@/hooks/useWindowSize";
import AddConnectionBtn from "@/features/manageSelections/AddConnectionBtn";
import Node from "@/features/graph/Node";
import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import RootNode from "@/features/graph/RootNode";
import { INode } from "@/features/graph/types/graphTypes";
import NodeTapDetector from "@/features/graph/NodeTapDetector";
import { View } from "@/components/Themed";
import AddGroupBtn from "@/features/addGroup/AddGroupBtn";

const nodes: INode[] = testNodes.nodes;

const Index = () => {
  const [selectedNodes, setSelectedNodes] = useState<INode[]>([]);

  const windowSize = useWindowSize();

  const totalNodes = nodes.length - 1;

  function getYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterY;
  }

  function getXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterX;
  }

  function getNodePosition(node: INode, index: number) {
    if (node.rootNode) {
      return { x: windowSize.windowCenterX, y: windowSize.windowCenterY };
    } else {
      return { x: getXValue(index), y: getYValue(index) };
    }
  }

  // TODO: Handle this logic in redux (It currently re-renders ALL nodes)
  function handleNodeSelect(node: INode) {
    setSelectedNodes((prevSelectedNodes) => {
      const nodeIndex = prevSelectedNodes.findIndex(
        (selectedNode) => selectedNode.id === node.id,
      );

      if (nodeIndex > -1) {
        // Node is already in the array, remove it
        return prevSelectedNodes.filter((_, index) => index !== nodeIndex);
      } else {
        // Node is not in the array, add it
        return [...prevSelectedNodes, node];
      }
    });
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Canvas
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          backgroundColor: "#121212",
        }}
      >
        {/* NODES ********************************************************** */}
        {nodes.map((node, index) => {
          if (node.rootNode) {
            return (
              <RootNode node={node} windowSize={windowSize} key={node.id} />
            );
          } else {
            return (
              <Node
                node={node}
                index={index}
                totalNodes={totalNodes}
                windowSize={windowSize}
                key={node.id}
              />
            );
          }
        })}
      </Canvas>

      {/* GESTURE DETECTORS ************************************************ */}
      {nodes.map((node, index) => {
        const { x, y } = getNodePosition(node, index);
        return (
          <NodeTapDetector
            key={node.id}
            node={node}
            nodePosition={{ x, y }}
            selectedNodes={selectedNodes}
            handleNodeSelect={handleNodeSelect}
          />
        );
      })}

      {/* MultiSelect and AddConnectionBtn ******************************** */}
      <View
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          gap: 8,
        }}
      >
        <AddGroupBtn selectedNodes={selectedNodes} />
        <AddConnectionBtn selectedNodes={selectedNodes} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#212121",
  },
});

export default Index;

// !TODO: FIRST FOR WED.
// !TODO: "add button" that pops up options based on what is selected
// !TODO: remove "group" and "add" btns and put them in add dialog
// Add connection, create connection, link nodes, create group, group selected nodes, etc...
// TODO: use custom icon for btn
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: Change "rootNode" to "isRootNode"
