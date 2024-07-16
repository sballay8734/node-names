import React from "react";
import { StyleSheet } from "react-native";
import { Canvas, Text as SkiaText } from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import testNodes from "../../data/mainMockData.json";
import useWindowSize from "@/hooks/useWindowSize";
import AddConnectionBtn from "@/features/addConnection/AddConnectionBtn";
import Node from "@/features/graph/Node";
import { REG_NODE_RADIUS, ROOT_NODE_RADIUS } from "@/constants/nodes";
import RootNode from "@/features/graph/RootNode";
import { INode } from "@/features/graph/types/graphTypes";
import MultiSelectToggle from "@/features/multiselect/MultiSelectToggle";

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

  const nodePositions = nodes.map((node, index) => {
    if (node.rootNode) {
      return { x: windowSize.windowCenterX, y: windowSize.windowCenterY };
    } else {
      return { x: getXValue(index), y: getYValue(index) };
    }
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <Canvas
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          backgroundColor: "green",
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
        const { x, y } = nodePositions[index];
        const radius = node.rootNode
          ? ROOT_NODE_RADIUS / 2
          : REG_NODE_RADIUS / 2;

        const detectorStyle: any = {
          position: "absolute",
          backgroudColor: "red",
          top: -radius,
          left: -radius,
          width: radius * 2,
          height: radius * 2,
          transform: [{ translateX: x }, { translateY: y }],
        };

        const gesture = Gesture.Tap().onStart(() => {
          console.log(`Tapped node ${node.firstName}`);
        });

        return (
          <GestureDetector key={node.id} gesture={gesture}>
            <Animated.View
              style={{
                ...detectorStyle,
                // backgroundColor: "red",
                opacity: 0.5,
                borderRadius: 100, // full (to make circle)
              }}
            />
          </GestureDetector>
        );
      })}
      <MultiSelectToggle />
      <AddConnectionBtn />
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

// NOTE: You may need to include reanimated in plugins (but it may also already be included with expo)
