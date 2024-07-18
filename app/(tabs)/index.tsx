import { Canvas, Line } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { REG_NODE_RADIUS, ROOT_NODE_RADIUS } from "@/constants/nodes";
import Node from "@/features/graph/Node";
import NodeTapDetector from "@/features/graph/NodeTapDetector";
import RootNode from "@/features/graph/RootNode";
import { INode } from "@/features/graph/types/graphTypes";
import Popover from "@/features/manageSelections/Popover";
import useWindowSize from "@/hooks/useWindowSize";

import testNodes from "../../data/mainMockData.json";

const nodes: INode[] = testNodes.nodes;

const Index = () => {
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

  function getEdgePoint(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const ratio = radius / distance;
    return {
      x: x1 + dx * ratio,
      y: y1 + dy * ratio,
    };
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Canvas
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          // backgroundColor: "#121212",
          backgroundColor: "transparent", // svg background color (above GHR)
        }}
      >
        {/* REMOVE: sudo links added just to test colors */}
        {/* LINKS ********************************************************** */}
        {nodes.map((node, index) => {
          if (!node.rootNode) {
            const { x: x1, y: y1 } = getNodePosition(node, index);
            const { x: x2, y: y2 } = getNodePosition(nodes[0], 0);
            const start = getEdgePoint(x1, y1, x2, y2, REG_NODE_RADIUS);
            const end = getEdgePoint(x2, y2, x1, y1, ROOT_NODE_RADIUS);
            return (
              <Line
                key={`line-${node.id}`}
                p1={start}
                p2={end}
                color={node.firstName.length < 6 ? "#222d38" : "#a2aeba"}
                style="fill"
                strokeWidth={2}
              />
            );
          }
        })}
        {/* NODES ********************************************************** */}
        {nodes.map((node, index) => {
          if (node.rootNode) {
            return (
              <RootNode node={node} windowSize={windowSize} key={node.id} />
            );
          } else {
            return (
              <Node
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
          <NodeTapDetector key={node.id} node={node} nodePosition={{ x, y }} />
        );
      })}

      {/* Popover Options ******************************** */}
      <Popover />
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
    backgroundColor: "transparent", // svg wrapper (below Canvas)
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default Index;

// !TODO: FIRST FOR WED.
// !TODO: "add button" that pops up options based on what is selected
// !TODO: remove "group" and "add" btns and put them in add dialog
// !TODO: View toggle (group View - zooms out, node view - zooms in)
// Add connection, create connection, link nodes, create group, group selected nodes, etc...
// TODO: use custom icon for btn
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: Change "rootNode" to "isRootNode"
