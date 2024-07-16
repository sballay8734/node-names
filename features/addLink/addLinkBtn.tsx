import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";

export default function AddLinkBtn(): React.JSX.Element {
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
      >
        <Text style={{ fontSize: 30 }}>+</Text>
      </Pressable>
    </View>
  );
}
