import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Index = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Hello World</Text>
    </View>
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
