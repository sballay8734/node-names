import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ARROW_BTN_DIM } from "@/lib/constants/styles";
import { WindowSize } from "@/lib/types/misc";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RecenterBtnProps {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  lastScale: SharedValue<number>;
  initialFocalX: SharedValue<number>;
  initialFocalY: SharedValue<number>;
  centerShiftX: SharedValue<number>;
  centerShiftY: SharedValue<number>;
  windowSize: WindowSize;
}

const BTN_DEFAULT_ANGLE = 45;
const ARROW_PADDING = 10;

const RecenterBtn = ({
  scale,
  translateX,
  translateY,
  lastScale,
  initialFocalX,
  initialFocalY,
  centerShiftX,
  centerShiftY,
  windowSize,
}: RecenterBtnProps): React.JSX.Element => {
  const isPressed = useSharedValue<boolean>(false);
  const { width, height, windowCenterX, windowCenterY } = windowSize;

  const arrowRotationStyle = useAnimatedStyle(() => {
    // Position of the button (bottom-left corner, translated by translateX, translateY)
    const btnX = ARROW_BTN_DIM / 2 + ARROW_PADDING;
    const btnY = height - ARROW_BTN_DIM / 2 - ARROW_PADDING;

    // Calculate the delta between button and screen center
    const deltaX = windowCenterX + translateX.value - btnX + centerShiftX.value;
    const deltaY = windowCenterY + translateY.value - btnY + centerShiftY.value;
    // !TODO: THIS HAS TO BE CLOSE BECAUSE ARROW IS FIXATED ON THE LAST CENTER LOCATION OF THE SCREEN ON PINCH

    // Calculate the angle and convert to degrees
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    return {
      transform: [{ rotate: `${angle + BTN_DEFAULT_ANGLE}deg` }],
    };
  });

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#060d0f" : "#091417", {
      duration: 200,
    }),
  }));

  // const arrowRotate = useAnimatedStyle(() => arrowData.value);
  const arrowOpacity = useAnimatedStyle(() => ({
    // opacity: withTiming(showArrow.value ? 1 : 0, { duration: 500 }),
    // REMOVE: Add above back after testing
    opacity: 1,
  }));

  const handlePressIn = () => {
    isPressed.value = true;
    console.log("Pressed ReCenter...");
    // centerOnRoot();
  };

  const handlePressOut = () => {
    isPressed.value = false;
    // REMOVE: Temp for easy sign out
    // supabase.auth.signOut();
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.btnWrapper, , animatedStyles, arrowOpacity]}
    >
      <Animated.View style={[styles.arrowContainer]}>
        {/* <Animated.View style={[styles.arrow, arrowRotate]}> */}
        <Animated.View style={[styles.arrow, arrowRotationStyle]}>
          <FontAwesome6 name="location-arrow" size={24} color="#fc4956" />
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    left: ARROW_PADDING,
    bottom: ARROW_PADDING,
    height: ARROW_BTN_DIM,
    width: ARROW_BTN_DIM,
    borderRadius: 100,
    borderColor: "#232a2b",
    borderWidth: 1,
  },
  arrowContainer: {
    // backgroundColor: "red",
    position: "absolute",
  },
  arrow: {
    width: 20,
    height: 20,
    marginBottom: 2,
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecenterBtn;
