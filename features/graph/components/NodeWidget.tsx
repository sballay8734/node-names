import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "@/components/Themed";

interface Props {
  count: number | null;
}

export default function NodeWidget({ count }: Props): React.JSX.Element | null {
  if (!count) return null;

  return (
    <Animated.View style={styles.widgetWrapper}>
      <Text
        style={{
          fontSize: 8,
          fontWeight: "bold",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        {count}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  widgetWrapper: {
    // backgroundColor: "#315c58",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 10,
    height: 10,
    borderRadius: 1,
    top: 0,
    right: 0,
    marginBottom: 5,
  },
});
