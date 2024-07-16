import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";

export default function AddConnectionBtn(): React.JSX.Element {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 60,
        width: 60,
        backgroundColor: "pink",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
      }}
    >
      <Pressable
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: 3,
        }}
        onPress={() => alert("Are you sure you want to add a connection to...")}
      >
        <Text style={{ fontSize: 30 }}>+</Text>
      </Pressable>
    </View>
  );
}
