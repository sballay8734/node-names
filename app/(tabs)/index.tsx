import { FontAwesome6 } from "@expo/vector-icons";
import { Canvas, Group } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import Node from "@/features/graph/Node";
import NodeTapDetector from "@/features/graph/NodeTapDetector";
import RecenterBtn from "@/features/graph/RecenterBtn";
import RootNode from "@/features/graph/RootNode";
import { INode } from "@/features/graph/types/graphTypes";
import Popover from "@/features/manageSelections/Popover";
import useWindowSize from "@/hooks/useWindowSize";

import testNodes from "../../data/mainMockData.json";

const nodes: INode[] = testNodes.nodes;

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const INITIAL_SCALE = 0.4;

const Index = () => {
  const windowSize = useWindowSize();

  const scale = useSharedValue(INITIAL_SCALE);
  const origin = useSharedValue({
    x: windowSize.windowCenterX / scale.value,
    y: windowSize.windowCenterY / scale.value,
  });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(1);

  const screenCenterX = windowSize.windowCenterX / scale.value;
  const screenCenterY = windowSize.windowCenterX / scale.value;

  const totalNodes = nodes.length - 1;

  // !TODO: THIS IS NOT EXACT. NEED TO TRACE ISSUE AND REFACTOR ALL THIS *******
  function getTRYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return (
      Math.sin(angle) * ROOT_NODE_RADIUS +
      windowSize.windowCenterY / scale.value
    );
  }

  // !TODO: REFACTOR ***********************************************************
  function getTRXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return (
      Math.cos(angle) * ROOT_NODE_RADIUS +
      windowSize.windowCenterX / scale.value
    );
  }
  // !TODO: REFACTOR ***********************************************************
  function getTouchResponderPosition(node: INode, index: number) {
    if (node.rootNode) {
      return {
        x: windowSize.windowCenterX / scale.value,
        y: windowSize.windowCenterY / scale.value,
      };
    } else {
      return {
        x: getTRXValue(index),
        y: getTRYValue(index),
      };
    }
  }

  const pan = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
  });

  const pinch = Gesture.Pinch()
    // .onStart((e) => {
    //   origin.value = { x: screenCenterX, y: screenCenterY };
    // })
    .onChange((e) => {
      const newScale = Math.min(
        Math.max(scale.value * e.scale, MIN_SCALE),
        MAX_SCALE,
      );
      scale.value = newScale;
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const transform = useDerivedValue(
    () => [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    [translateX, translateY, scale],
  );

  function handleCenter() {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0, 0.95, 0.55, 1),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0, 0.95, 0.55, 1),
    });
    lastScale.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(INITIAL_SCALE, {
      duration: 500,
      easing: Easing.bezier(0, 0.95, 0.55, 1),
    });
  }

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.red}>
        <Canvas style={{ flex: 1 }}>
          {/* NODES **************************************************** */}
          <Group transform={transform}>
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
        {/* {nodes.map((node, index) => {
          const { x, y } = getNodePosition(node, index);
          return (
            <NodeTapDetector
              key={node.id}
              node={node}
              nodePosition={{ x, y }}
            />
          );
        })} */}
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
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  green: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,255,17,0.2)", // svg wrapper (below Canvas)
    // borderWidth: 2,
    // WARNING: Adding border here will screw up layout slightly (BE CAREFUL)
  },
  red: {
    flex: 1,
    // height: "100%",
    // width: "100%",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "rgba(255, 0, 0, 0.1)", // svg wrapper (below Canvas)
    // WARNING: Adding border here will screw up layout slightly (BE CAREFUL)
  },
  canvas: {
    flex: 1,
    // height: "100%",
    // width: "100%",
    // overflow: "hidden",
    backgroundColor: "rgba(0, 4, 255, 0.5)", // BLUE
    opacity: 0.3,
  },
});

export default Index;

// !TODO: FIRST FOR FRI. ****************************************************
// 1. You're CLOSE but not quite -- LOOK HERE (https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/sticker-app/src/GestureHandler.tsx)

// reduce velocity of pinch gesture

// 1. YOU NEED TO ADD TAP DETECTORS BACK SOMEHOW!!

// 1. only show centering btn if root node is off screen (out of bounds)

// !!!!!!!!!! STOP: REFACTOR EVERYTHING BEFORE MOVING FORWARD !!!!!!!!!!

// 2. Assume everyone starts with only the root node and build from there
// 2a. Based on 2, start with connecting a new node to the root and creating a node NOT connected to the root WITH LINKS
// 3. After 2a, work on grouping logic

// !TODO: View toggle (group View - zooms out, node view - zooms in)
// Add connection, create connection, link nodes, create group, group selected nodes, etc...
// TODO: use custom icon for btn
// TODO: Recenter button should be an arrow that ALWAYS points towards root (so you'll need to animate the rotation)
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: Change "rootNode" to "isRootNode"
