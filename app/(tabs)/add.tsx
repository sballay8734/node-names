import { StyleSheet, View, Text } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";

export default function AddBtn() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>+</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
