import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  DerivedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ARROW_BTN_RADIUS } from "@/constants/styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  centerOnRoot: () => void;
  arrowData: DerivedValue<{ transform: { rotate: string }[] }>;
  showArrow: DerivedValue<boolean>;
}

const RecenterBtn = ({
  centerOnRoot,
  arrowData,
  showArrow,
}: Props): React.JSX.Element => {
  const isPressed = useSharedValue<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#060d0f" : "#091417", {
      duration: 200,
    }),
  }));

  const arrowRotate = useAnimatedStyle(() => arrowData.value);
  const arrowOpacity = useAnimatedStyle(() => ({
    // opacity: withTiming(showArrow.value ? 1 : 0, { duration: 500 }),
    // REMOVE: Add above back after testing
    opacity: 1,
  }));

  const handlePressIn = () => {
    isPressed.value = true;
    centerOnRoot();
  };

  const handlePressOut = () => {
    isPressed.value = false;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.recenterButton, animatedStyles, arrowOpacity]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.arrow, arrowRotate]}>
          <FontAwesome6 name="location-arrow" size={24} color="#fc4956" />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  recenterButton: {
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
    transform: [{ rotate: "46deg" }], // TODO: SHOULD NOT BE HARDCODED: ORIGINAL VALUE vvvv
  },
  buttonContent: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    width: 20,
    height: 20,
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecenterBtn;
