import { Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { View, Text } from "@/components/Themed";

export default function MultiSelectToggle(): React.JSX.Element {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
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
        }}
        onPress={() => alert("You've entered Multiselect Mode...")}
      >
        <MaterialCommunityIcons
          name="gamepad-circle-up"
          size={24}
          color="black"
        />
      </Pressable>
    </View>
  );
}
