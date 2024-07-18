import { Canvas, Group, Line } from "@shopify/react-native-skia";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/Themed";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constants/graph";
import { REG_NODE_RADIUS, ROOT_NODE_RADIUS } from "@/constants/nodes";
import Node from "@/features/graph/Node";
import NodeTapDetector from "@/features/graph/NodeTapDetector";
import RootNode from "@/features/graph/RootNode";
import { INode } from "@/features/graph/types/graphTypes";
import Popover from "@/features/manageSelections/Popover";
import useWindowSize from "@/hooks/useWindowSize";

import testNodes from "../../data/mainMockData.json";
import RecenterBtn from "@/features/graph/RecenterBtn";
import { FontAwesome6 } from "@expo/vector-icons";

const nodes: INode[] = testNodes.nodes;

const Index = () => {
  const windowSize = useWindowSize();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 5;

  const MIN_X = -500;
  const MAX_X = 500;
  const MIN_Y = -500;
  const MAX_Y = 500;

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

  // !TODO: THIS IS NOT EXACT. NEED TO TRACE ISSUE AND REFACTOR ALL THIS *******
  function getTRYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * ROOT_NODE_RADIUS + CANVAS_HEIGHT / 4.93;
  }

  // !TODO: REFACTOR ***********************************************************
  function getTRXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * ROOT_NODE_RADIUS + CANVAS_WIDTH / 2;
  }
  // !TODO: REFACTOR ***********************************************************
  function getTouchResponderPosition(node: INode, index: number) {
    if (node.rootNode) {
      return { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 4.93 };
    } else {
      return { x: getTRXValue(index), y: getTRYValue(index) };
    }
  }

  const pan = Gesture.Pan().onChange((e) => {
    // Clamp the new translation values within the defined limits
    translateX.value = Math.min(
      Math.max(translateX.value + e.changeX, MIN_X),
      MAX_X,
    );
    translateY.value = Math.min(
      Math.max(translateY.value + e.changeY, MIN_Y),
      MAX_Y,
    );
  });

  const pinch = Gesture.Pinch()
    .onChange((e) => {
      const newScale = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
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

  // !TODO: Animate this movement **********************************************
  function handleCenter() {
    translateX.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(1, { duration: 200 });
    savedScale.value = 1;
  }

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.green}>
        <Animated.View style={[styles.red, animatedStyle]}>
          <Canvas
            style={{
              flex: 1,
              height: CANVAS_HEIGHT,
              width: CANVAS_WIDTH,
              // backgroundColor: "#121212",
              backgroundColor: "transparent", // svg background color (above GHR)
              opacity: 0.3,
            }}
          >
            <Group>
              {/* NODES **************************************************** */}
              {nodes.map((node, index) => {
                const { x, y } = getTouchResponderPosition(node, index);

                if (node.rootNode) {
                  return <RootNode nodePosition={{ x, y }} key={node.id} />;
                } else {
                  return <Node nodePosition={{ x, y }} key={node.id} />;
                }
              })}
            </Group>
          </Canvas>
          {/* Touch Responders ********************************************* */}
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
        <Popover />
        <RecenterBtn
          icon={
            <FontAwesome6
              name="down-left-and-up-right-to-center"
              size={24}
              color="black"
            />
          }
          handleCenter={handleCenter}
        ></RecenterBtn>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  green: {
    // flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // svg wrapper (below Canvas)
  },
  red: {
    // flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    // backgroundColor: "rgba(1, 1, 1, 0.5)", // svg wrapper (below Canvas)
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

// !TODO: FIRST FOR FRI. ****************************************************
// 1. only show centering btn if root node is off screen (out of bounds)

// !!!!!!!!!! STOP: REFACTOR EVERYTHING BEFORE MOVING FORWARD !!!!!!!!!!

// 1a. CURRENTLY the bigger the scale, the less you can pan // !TODO: SO, you need to fix this. BE CAREFUL)
// 2. Assume everyone starts with only the root node and build from there
// 2a. Based on 2, start with connecting a new node to the root and creating a node NOT connected to the root WITH LINKS
// 3. After 2a, work on grouping logic

// !TODO: View toggle (group View - zooms out, node view - zooms in)
// Add connection, create connection, link nodes, create group, group selected nodes, etc...
// TODO: use custom icon for btn
// TODO: Recenter button should be an arrow that ALWAYS points towards root (so you'll need to animate the rotation)
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: Change "rootNode" to "isRootNode"
