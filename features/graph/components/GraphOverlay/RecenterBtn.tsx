import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  ARROW_BTN_DIM,
  ARROW_BTN_RADIUS,
  TAB_BAR_HEIGHT,
} from "@/lib/constants/styles";
import { WindowSize } from "@/lib/types/misc";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RecenterBtnProps {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  lastScale: SharedValue<number>;
  initialFocalX: SharedValue<number>;
  initialFocalY: SharedValue<number>;
  scaleDelta: SharedValue<number>;
  windowSize: WindowSize;
}

const RecenterBtn = ({
  scale,
  translateX,
  translateY,
  lastScale,
  initialFocalX,
  initialFocalY,
  scaleDelta,
  windowSize,
}: RecenterBtnProps): React.JSX.Element => {
  const isPressed = useSharedValue<boolean>(false);
  const { width, height, windowCenterX, windowCenterY } = windowSize;

  const initTargetX = windowCenterX - ARROW_BTN_RADIUS;
  const initTargetY = windowCenterY - ARROW_BTN_RADIUS;
  // position CENTER POINT of button
  const padding = 10;
  const buttonX = initTargetX - width / 2 + ARROW_BTN_RADIUS + padding;
  const buttonY = initTargetY + height / 2 - ARROW_BTN_RADIUS - padding;

  const targetX = useDerivedValue(() => {
    return (initTargetX + translateX.value) * scale.value;
  });
  const targetY = useDerivedValue(() => {
    return (initTargetY + translateY.value) * scale.value;
  });

  // const rotate = useDerivedValue(() => {
  //   // Calculate the vector from the button to the transformed center
  //   const deltaX = targetX.value - buttonX;
  //   const deltaY = targetY.value - buttonY;
  //   console.log(initialFocalX.value, initialFocalY.value);
  //   // Calculate the angle
  //   const angleInRads = Math.atan2(deltaY, deltaX);
  //   const newAngle = angleInRads * (180 / Math.PI);

  //   // Return the angle as a string for use in rotation
  //   return `${newAngle}deg`;
  // });

  // const animatedArrow = useAnimatedStyle(() => ({
  //   transform: [
  //     {
  //       rotate: rotate.value,
  //     },
  //   ],
  // }));

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
      style={[
        styles.btnWrapper,
        {
          transform: [
            { translateX: buttonX },
            { translateY: buttonY },
            // This rotate is needed to normalize starting point of arrow's orientation
            { rotate: "45deg" },
          ],
        },
        animatedStyles,
        arrowOpacity,
      ]}
    >
      <Animated.View style={[styles.arrowContainer]}>
        {/* <Animated.View style={[styles.arrow, arrowRotate]}> */}
        <Animated.View style={[styles.arrow]}>
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

const rtPos = {
  angle: 0,
  depth: 1,
  group_id: null,
  group_name: "Root",
  id: 1,
  isRoot: true,
  isShown: true,
  name: "Root",
  node_status: "active",
  source_type: null,
  type: "node",
  x: 196.5,
  y: 386.5,
};
