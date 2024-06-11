import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import * as d3 from "d3";
import Circles from "@/components/ChartElements/Circles";
import { generateDataset } from "@/data/testDataset";
import AnimatedCircles from "@/components/ChartElements/AnimatedCircles";
import { useSpring, animated } from "@react-spring/native";
import graphData from "../../data/miserables.json";
import ForceGraph from "@/components/ChartElements/ForceGraph";
import TestForceGraph from "@/components/ChartElements/TestForceGraph";
import mainMockData from "../../data/mainMockData.json";

type Point = [number, number];
type Data = number[][];

const Index = () => {
  // TODO: Need to type useState here
  const [dataset, setDataset] = useState<Data>(generateDataset());

  // **************************** YESSSSSSSSS *********************************
  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 3000 },
  });

  return (
    <View style={styles.container}>
      {/* <Circles dataset={dataset} /> */}
      {/* <animated.View style={{ ...props, flexGrow: 1 }}>
        <Text style={{ color: "white", fontSize: 20 }}>Hello World!</Text>
      </animated.View>
      <AnimatedCircles dataset={dataset} />
      {/* <ForceGraph dataset={graphData} /> */}
      <TestForceGraph dataset={mainMockData} />
      <Pressable
        style={styles.button}
        onPress={() => setDataset(generateDataset())}
      >
        <Text style={styles.text}>Generate New Data</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
