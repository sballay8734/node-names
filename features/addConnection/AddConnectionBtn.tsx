import { Pressable } from "react-native";

import { View } from "@/components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { INodeWSelect } from "@/app/(tabs)";

interface Props {
  nodeStates: INodeWSelect | null;
  isMultiMode: boolean;
}

export default function AddConnectionBtn({
  nodeStates,
  isMultiMode,
}: Props): React.JSX.Element {
  const isEnabled =
    !isMultiMode && nodeStates !== null && Object.keys(nodeStates).length === 1;

  const handlePress = () => {
    if (nodeStates) {
      const selectedNode = Object.values(nodeStates)[0];
      alert(
        `Are you sure you want to add a connection to ${selectedNode.firstName} ${selectedNode.lastName}?`,
      );
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 85,
        right: 15,
        height: 60,
        width: 60,
        backgroundColor: "pink",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        // mTODO: Animate the opacity vvvv
        opacity: isEnabled ? 1 : 0,
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
        onPress={handlePress}
      >
        <Ionicons name="add" size={30} color="black" />
      </Pressable>
    </View>
  );
}

// !TODO: If only one node is selected in multimode, addLinkBtn should still be visible
// TODO: use custom icon for btn
