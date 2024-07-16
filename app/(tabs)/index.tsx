import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  matchFont,
  Text as SkiaText,
} from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import testNodes from "../../data/mainMockData.json";
import useWindowSize from "@/hooks/useWindowSize";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import AddLinkBtn from "@/features/addLink/addLinkBtn";

interface Node {
  id: number;
  rootNode: boolean;
  firstName: string;
  lastName: string;
  group: string | null;
  sex: string;
}

const nodes: Node[] = testNodes.nodes;

const rootRad = 100;
const regRad = 50;

const Index = () => {
  const windowSize = useWindowSize();
  // !TODO: Custom fonts from EXPO are NOT working vvvvv
  // const fontFamily = Platform.select({ ios: "SpaceMono", default: "serif" });

  // Font config ***************************************************************
  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });

  // TODO: Font size should be based on node width
  const fontStyle = {
    fontFamily,
    fontSize: 12,
  };
  const font = matchFont(fontStyle);

  // Node position config ******************************************************
  const totalNodes = nodes.length - 1;

  // word circle around root node
  function getYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * rootRad + windowSize.windowCenterY;
  }

  function getXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * rootRad + windowSize.windowCenterX;
  }

  const nodePositions = nodes.map((node, index) => {
    if (node.rootNode) {
      return { x: windowSize.windowCenterX, y: windowSize.windowCenterY };
    } else {
      return { x: getXValue(index), y: getYValue(index) };
    }
  });

  // Node Touch Config  ********************************************************
  const tap = Gesture.Tap().onStart(() => {
    console.log("tap");
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
              <Group key={node.id}>
                <Circle
                  color={"red"}
                  cx={windowSize.windowCenterX}
                  cy={windowSize.windowCenterY}
                  r={rootRad / 2}
                />
                <SkiaText
                  color={"black"}
                  x={
                    windowSize.windowCenterX -
                    font.measureText(node.firstName).width / 2
                  }
                  // mTODO: vv This is NOT exact center close enough for now
                  y={
                    windowSize.windowCenterY +
                    font.measureText(node.firstName).height / 2 / 2
                  }
                  text={node.firstName}
                  font={font}
                  strokeWidth={2}
                  style={"fill"}
                />
              </Group>
            );
          } else {
            return (
              <Group key={node.id} style={"fill"}>
                <Circle
                  color={"blue"}
                  cx={getXValue(index)}
                  cy={getYValue(index)}
                  r={regRad / 2}
                />
                <SkiaText
                  x={
                    getXValue(index) -
                    font.measureText(node.firstName).width / 2
                  }
                  y={
                    getYValue(index) +
                    font.measureText(node.firstName).height / 2 / 2
                  }
                  text={node.firstName}
                  font={font}
                  style={"fill"}
                />
              </Group>
            );
          }
        })}
      </Canvas>

      {/* GESTURE DETECTORS ************************************************ */}
      {nodes.map((node, index) => {
        const { x, y } = nodePositions[index];
        const radius = node.rootNode ? rootRad / 2 : regRad / 2;

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
      <AddLinkBtn />
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
