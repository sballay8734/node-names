import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import * as d3 from "d3";
import Circles from "@/components/ChartElements/Circles";
import { generateDataset } from "@/data/testDataset";
import AnimatedCircles from "@/components/ChartElements/AnimatedCircles";

// TODO: Need to type "data" properly (d3 types)
function ForceGraph({ data }: any) {}

type Point = [number, number];
type Data = number[][];

const Index = () => {
  // TODO: Need to type useState here
  const [dataset, setDataset] = useState<Data>(generateDataset());

  return (
    <View style={styles.container}>
      <Circles dataset={dataset} />
      <AnimatedCircles dataset={dataset} />
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
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
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
