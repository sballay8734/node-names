import React, { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { StyleSheet, Pressable, Text } from "react-native";
import * as d3 from "d3";
import { generateDataset } from "@/data/testDataset";
import { useSpring } from "@react-spring/native";
import TestForceGraph from "@/components/ChartElements/TestForceGraph";
import mainMockData from "../../data/mainMockData.json";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Data = number[][];

const Index = () => {
  // TODO: This just triggers a reload of TestForceGraph
  const [dataset, setDataset] = useState<Data>(generateDataset());

  // **************************** YESSSSSSSSS *********************************
  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 3000 },
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <TestForceGraph dataset={mainMockData} />
      <Pressable
        style={styles.button}
        onPress={() => setDataset(generateDataset())}
      >
        <Text style={styles.text}>Generate New Data</Text>
      </Pressable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#452b2b",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    opacity: 0.9,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Index;
