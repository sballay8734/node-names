import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  DerivedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { View } from "@/components/Themed";
import { ARROW_BTN_RADIUS } from "@/constants/styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  handleCenter: () => void;
  arrowData: DerivedValue<{ transform: { rotate: string }[] }>;
}

export default function RecenterBtn({
  handleCenter,
  arrowData,
}: Props): React.JSX.Element {
  const isPressed = useSharedValue<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#FFE04B" : "#B58DF1", {
      duration: 100,
    }),
  }));

  const arrowStyles = useAnimatedStyle(() => arrowData.value);

  function handlePressIn() {
    isPressed.value = true;
    handleCenter();
  }

  function handlePressOut() {
    isPressed.value = false;
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bottom: 10,
          left: 10,
          height: ARROW_BTN_RADIUS * 2,
          width: ARROW_BTN_RADIUS * 2,
          borderRadius: 100,
          backgroundColor: "green",
          // TODO: SHOULD NOT BE HARDCODED vvvv
          transform: [{ rotate: "47deg" }],
        },
        animatedStyles,
      ]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.arrow, arrowStyles]}>
          <FontAwesome5 name="location-arrow" size={18} color="black" />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
