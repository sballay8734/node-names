import { Pressable } from "react-native";

import { View } from "@/components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { INode } from "../graph/types/graphTypes";
import { Text } from "@/components/Themed";
import { FontAwesome6 } from "@expo/vector-icons";

interface Props {
  selectedNodes: INode[];
}

export default function AddConnectionBtn({
  selectedNodes,
}: Props): React.JSX.Element {
  const isEnabled = selectedNodes.length >= 1;

  const handlePress = () => {
    alert(`Add connection ${selectedNodes.length} ppl`);
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
        <Text style={{ color: "black", fontSize: 10 }}>
          {selectedNodes.length >= 2 ? "Link Nodes" : "Add Connection"}
        </Text>
        {selectedNodes.length >= 2 ? (
          <FontAwesome6 name="link" size={12} color="black" />
        ) : (
          <Ionicons name="add-circle-outline" size={14} color="black" />
        )}
      </Pressable>
    </View>
  );
}
