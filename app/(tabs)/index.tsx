import { Canvas, Group } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import { ARROW_BTN_RADIUS, TAB_BAR_HEIGHT } from "@/constants/styles";
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

const ARROW_BTN_LEFT = 10;
const ARROW_BTN_BTM = 10;

const Index = () => {
  const windowSize = useWindowSize();

  const scale = useSharedValue(INITIAL_SCALE);
  // origin = point on Group directly under center point on Canvas
  const origin = useSharedValue({
    x: windowSize.windowCenterX,
    y: windowSize.windowCenterY,
  });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);

  const ARROW_BTN_CENTER = {
    x: ARROW_BTN_LEFT + ARROW_BTN_RADIUS, // Left margin AND CENTER of button
    y: windowSize.height - TAB_BAR_HEIGHT - ARROW_BTN_BTM - ARROW_BTN_RADIUS,
  };

  const totalNodes = nodes.length - 1;

  // Calculate Y value of node within the group
  function calcNodeYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterY;
  }

  // Calculate X value of node within the group save
  function calcNodeXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterX;
  }

  function getNodePosition(node: INode, index: number) {
    if (node.rootNode) {
      return {
        x: windowSize.windowCenterX,
        y: windowSize.windowCenterY,
      };
    } else {
      return {
        x: calcNodeXValue(index),
        y: calcNodeYValue(index),
      };
    }
  }

  const pan = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
    origin.value = {
      x: e.changeX,
      y: e.changeY,
    };
  });

  console.log("ORIGIN:", origin.value);

  const pinch = Gesture.Pinch()
    // Calc the point on the group that is under the center point on the canva
    .onStart((e) => {
      origin.value = {
        x: windowSize.windowCenterX - translateX.value,
        y: windowSize.windowCenterY - translateY.value,
      };

      // console.log("START ORIGIN:", origin.value);
    })
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

  const composed = Gesture.Race(pan, pinch);

  const tapTransform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  const svgTransform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  console.log(svgTransform.value);

  function handleCenter() {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    lastScale.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(INITIAL_SCALE, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
  }

  const arrowData = useDerivedValue(() => {
    const rootNodePos = {
      x: windowSize.windowCenterX + translateX.value,
      y: windowSize.windowCenterY + translateY.value,
    };

    // Calculate the differences in x and y coordinates
    const dx = rootNodePos.x - ARROW_BTN_CENTER.x;
    const dy = rootNodePos.y - ARROW_BTN_CENTER.y;

    // Calculate the angle in radians
    const angle = Math.atan2(dy, dx);

    // Convert the angle to degrees
    const angleInDegrees = (angle * 180) / Math.PI;

    return {
      transform: [{ rotate: `${angleInDegrees}deg` }],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.canvasWrapper}>
        {/* !TODO: THESE NODES MAY NOT BE NEEDED vvvvvvvvvvvvvvvvvvvvvvv */}
        {/* <Canvas style={{ flex: 1, backgroundColor: "transparent" }}> */}
        {/* NODES **************************************************** */}
        {/* <Group
            origin={{ x: origin.value.x, y: origin.value.y }}
            transform={svgTransform}
          >
            {nodes.map((node, index) => {
              const { x, y } = getNodePosition(node, index);
              if (node.rootNode) {
                return <RootNode nodePosition={{ x, y }} key={node.id} />;
              } else {
                return <Node nodePosition={{ x, y }} key={node.id} />;
              }
            })}
          </Group>
        </Canvas> */}
        {/* !TODO: THESE NODES MAY NOT BE NEEDED ^^^^^^^^^^^^^^^^^^^^^^ */}
        {/* Touch Responders ********************************************* */}
        <Animated.View
          style={{ ...styles.tapWrapper, transform: tapTransform }}
        >
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
        <RecenterBtn handleCenter={handleCenter} arrowData={arrowData} />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    flex: 1,
    backgroundColor: "rgba(255, 0, 0, 0)",
    // WARNING: Adding border here will screw up layout slightly (BE CAREFUL)
  },
  canvas: {
    flex: 1,
    backgroundColor: "rgba(0, 4, 255, 0.5)", // BLUE
    opacity: 0.3,
  },
  tapWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    flex: 1,
  },
});

export default Index;

// !TODO: FIRST FOR FRI. ****************************************************
// 1. only show centering btn if root node is off screen (out of bounds)
// SEE HERE FOR #1 (https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/animating-styles-and-props)

// !TODO: DOUBLE CHECK THAT NODES ARE ALIGNED
// !!!!!!!!!! STOP: REFACTOR EVERYTHING BEFORE MOVING FORWARD !!!!!!!!!!

// 2. Assume everyone starts with only the root node and build from there
// 2a. Based on 2, start with connecting a new node to the root and creating a node NOT connected to the root WITH LINKS
// 3. After 2a, work on grouping logic

// !TODO: View toggle (group View - zooms out, node view - zooms in)
// Add connection, create connection, link nodes, create group, group selected nodes, etc...

// TODO: use custom icon for btn
// TODO: Recenter button should be an arrow that ALWAYS points towards root (so you'll need to animate the rotation)
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: You shouldn't have to do ROOT_NODE_RADIUS / 2 anywhere
// mTODO: Pinch Center doesn't quite align with RootNode center
// mTODO: Change "rootNode" to "isRootNode"
