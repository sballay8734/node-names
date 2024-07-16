import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Canvas, Text as SkiaText } from "@shopify/react-native-skia";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import testNodes from "../../data/mainMockData.json";
import useWindowSize from "@/hooks/useWindowSize";
import AddConnectionBtn from "@/features/addConnection/AddConnectionBtn";
import Node from "@/features/graph/Node";
import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import RootNode from "@/features/graph/RootNode";
import { INode } from "@/features/graph/types/graphTypes";
import MultiSelectToggle from "@/features/multiselect/MultiSelectToggle";
import NodeTapDetector from "@/features/graph/NodeTapDetector";

const nodes: INode[] = testNodes.nodes;

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);

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
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
    }
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
            selectedNode={selectedNode}
            handleNodeSelect={handleNodeSelect}
          />
        );
      })}

      {/* MultiSelect and AddConnectionBtn ******************************** */}
      <MultiSelectToggle />
      <AddConnectionBtn selectedNode={selectedNode} />
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

// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: Change "rootNode" to "isRootNode"
