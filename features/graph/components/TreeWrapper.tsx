import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { testData } from "@/lib/utils/newTreeGraphStrategy";

import Tree from "./Tree";

const TreeWrapper: React.FC = () => {
  return (
    <Animated.View style={styles.treeWrapper}>
      <Tree data={testData} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  treeWrapper: {
    position: "absolute",
    backgroundColor: "red",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    // flex: 1,
  },
});

export default TreeWrapper;
