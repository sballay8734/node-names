import React from "react";
import { Canvas, Circle, Group, Text } from "@shopify/react-native-skia";
import { View, StyleSheet } from "react-native";

const Index = () => {
  const width = 256;
  const height = 256;
  const r = width * 0.33;
  return (
    <View style={styles.container}>
      <Canvas style={{ width, height }}>
        <Group blendMode="multiply">
          <Circle cx={r} cy={r} r={r} color="cyan" />
          <Circle cx={width - r} cy={r} r={r} color="magenta" />
          <Circle cx={width / 2} cy={width - r} r={r} color="yellow" />
        </Group>
      </Canvas>
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
});

export default Index;
