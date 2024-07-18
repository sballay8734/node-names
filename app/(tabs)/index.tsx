import { Canvas, Group, Line } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

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

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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

  const pan = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd((e) => {
      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [-1000, 1000],
      });
      translateY.value = withDecay({
        velocity: e.velocityY,
        clamp: [-1000, 1000],
      });
    });

  const pinch = Gesture.Pinch()
    .onChange((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Canvas
            style={{
              flex: 1,
              height: "100%",
              width: "100%",
              // backgroundColor: "#121212",
              backgroundColor: "red", // svg background color (above GHR)
              opacity: 0.3,
            }}
          >
            <Group>
              {/* REMOVE: sudo links added just to test colors */}
              {/* LINKS ******************************************************** */}
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
              {/* NODES ******************************************************** */}
              {nodes.map((node, index) => {
                if (node.rootNode) {
                  return (
                    <RootNode
                      node={node}
                      windowSize={windowSize}
                      key={node.id}
                    />
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
            </Group>
          </Canvas>
          {/* Touch Responders ************************************************* */}
          {nodes.map((node, index) => {
            const { x, y } = getNodePosition(node, index);
            return (
              <NodeTapDetector
                key={node.id}
                node={node}
                nodePosition={{ x, y }}
              />
            );
          })}
        </Animated.View>
      </GestureDetector>
      <Popover />
    </View>
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

// !TODO: FIRST FOR THURS. ****************************************************
// 1. configure canvas to be scrollable and test with extra nodes
// 2. Assume everyone starts with only the root node and build from there
// 2a. Based on 2, start with connecting a new node to the root and creating a node NOT connected to the root WITH LINKS
// 3. After 2a, work on grouping logic

// !TODO: View toggle (group View - zooms out, node view - zooms in)
// Add connection, create connection, link nodes, create group, group selected nodes, etc...
// TODO: use custom icon for btn
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: Change "rootNode" to "isRootNode"
