import { Pressable } from "react-native";

import { View, Text } from "@/components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export default function AddConnectionBtn(): React.JSX.Element {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

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
        opacity: isEnabled ? 1 : 0.5,
        pointerEvents: isEnabled ? "auto" : "none",
      }}
    >
      <Pressable
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
        onPress={() => alert("Are you sure you want to add a connection to...")}
      >
        <Ionicons name="add" size={30} color="black" />
      </Pressable>
    </View>
  );
}

// !TODO: Should be greyed out if no node is selected
// TODO: use custom icon for btn
