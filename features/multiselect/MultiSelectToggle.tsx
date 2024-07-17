import { Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { View } from "@/components/Themed";
import { INode } from "../graph/types/graphTypes";

interface Props {
  isMultiMode: boolean;
  toggleMultiSelectMode: () => void;
}

export default function MultiSelectToggle({
  isMultiMode,
  toggleMultiSelectMode,
}: Props): React.JSX.Element {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 15,
        right: 15,
        height: 60,
        width: 60,
        backgroundColor: "pink",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,

        // TODO: Animate opacity change vvvv
        opacity: isMultiMode ? 1 : 0.1,
      }}
    >
      <Pressable
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
        onPress={toggleMultiSelectMode}
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
