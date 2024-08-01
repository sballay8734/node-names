import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";

import { View, Text } from "@/components/Themed";
import { INode } from "@/features/D3/types/d3Types";

interface Props {
  selectedNodes: INode[];
}

export default function AddGroupBtn({
  selectedNodes,
}: Props): React.JSX.Element {
  const isEnabled = selectedNodes.length >= 1;

  const handlePress = () => {
    alert(`${isEnabled}`);
  };

  return (
    <View
      style={{
        backgroundColor: "pink",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        // mTODO: Animate the opacity vvvv
        opacity: isEnabled ? 1 : 0.1,
        pointerEvents: isEnabled ? "auto" : "none",
      }}
    >
      <Pressable
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}
        onPress={handlePress}
      >
        <Text style={{ color: "black", fontSize: 10 }}>Group</Text>
        <Ionicons name="add-circle-outline" size={14} color="black" />
      </Pressable>
    </View>
  );
}

// !TODO: If only one node is selected in multimode, addLinkBtn should still be visible
// TODO: use custom icon for btn
