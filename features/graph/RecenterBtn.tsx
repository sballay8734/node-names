import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
  showArrow: DerivedValue<boolean>;
}

export default function RecenterBtn({
  handleCenter,
  arrowData,
  showArrow,
}: Props): React.JSX.Element {
  const isPressed = useSharedValue<boolean>(false);
  console.log(showArrow);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#060d0f" : "#091417", {
      duration: 100,
    }),
  }));

  const arrowRotate = useAnimatedStyle(() => arrowData.value);
  const arrowOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(showArrow.value ? 1 : 0, { duration: 500 }),
  }));

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
          borderColor: "#232a2b",
          borderWidth: 1,
          backgroundColor: "transparent",
          // TODO: SHOULD NOT BE HARDCODED: ORIGINAL VALUE vvvv
          transform: [{ rotate: "46deg" }],
        },
        animatedStyles,
        arrowOpacity,
      ]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.arrow, arrowRotate]}>
          <FontAwesome6 name="location-arrow" size={20} color="#fc4956" />
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

// TODO: Arrow isn't quite centered in the circle
