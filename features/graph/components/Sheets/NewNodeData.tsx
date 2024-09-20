import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function NewNodeData() {
  const isShown = false;

  // TODO: Translate this UP from bottom also
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isShown ? 1 : 0, { duration: 150 }),
      pointerEvents: isShown ? "auto" : "none",
    };
  });

  return (
    <Animated.View style={[styles.wrapper, animatedStyles]}>
      <Text>NEW NODE INFO</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 3,
    borderColor: "green",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 200,
    backgroundColor: "white",
  },
});
