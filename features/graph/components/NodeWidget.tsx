import { StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";

interface Props {
  hiddenConnections: number;
}

export default function NodeWidget({
  hiddenConnections,
}: Props): React.JSX.Element | null {
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
        {hiddenConnections}
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
