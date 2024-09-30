import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

import { ARROW_BTN_DIM, ARROW_BTN_RADIUS } from "@/lib/constants/styles";
import { WindowSize } from "@/lib/types/misc";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RecenterBtnProps {
  gestures: {
    scale: SharedValue<number>;
    translateX: SharedValue<number>;
    translateY: SharedValue<number>;
    lastScale: SharedValue<number>;
    initialFocalX: SharedValue<number>;
    initialFocalY: SharedValue<number>;
    centerShiftX: SharedValue<number>;
    centerShiftY: SharedValue<number>;
  };
  windowSize: WindowSize;
}

const ARROW_PADDING = 10;

const RecenterBtn = ({
  gestures,
  windowSize,
}: RecenterBtnProps): React.JSX.Element => {
  const isPressed = useSharedValue<boolean>(false);
  const { width, height, windowCenterX, windowCenterY } = windowSize;

  const arrowRotationStyle = useAnimatedStyle(() => {
    // Position of the button (bottom-left corner, translated by translateX, translateY)
    const btnX = ARROW_BTN_DIM / 2 + ARROW_PADDING;
    const btnY = height - ARROW_BTN_DIM / 2 - ARROW_PADDING;

    // Calculate the delta between button and screen center
    const deltaX =
      gestures.translateX.value + windowCenterX * gestures.scale.value - btnX;
    const deltaY =
      gestures.translateY.value + windowCenterY * gestures.scale.value - btnY;
    // !TODO: THIS HAS TO BE CLOSE BECAUSE ARROW IS FIXATED ON THE LAST CENTER LOCATION OF THE SCREEN ON PINCH

    // console.log("BTNX:", btnX);
    // console.log("BTNY:", btnY);
    // console.log("CHANGE FROM ARROW X:", deltaX);
    // console.log("CHANGE FROM ARROW Y:", deltaY);

    // Calculate the angle and convert to degrees
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    console.log("ANGLE: ", angle);

    return {
      transform: [{ rotate: `${angle}deg` }],
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
          <Svg height={30} width={40} viewBox="0 0 100 100">
            <Path
              d="M50.03 5a2.516 2.516 0 0 0-2.43 1.76L34.493 48.548a2.51 2.51 0 0 0-.372 1.454c-.026.51.104 1.017.372 1.452l13.105 41.782c.737 2.352 4.065 2.352 4.802 0l13.105-41.785c.27-.436.399-.945.372-1.456a2.513 2.513 0 0 0-.372-1.45L52.401 6.76A2.513 2.513 0 0 0 50.03 5zM39.403 50.288h6.205c.152 2.306 2.048 4.134 4.392 4.134c2.344 0 4.24-1.828 4.392-4.134h6.461L50 84.078z"
              fill="#fc4956"
            />
          </Svg>
          {/* <FontAwesome6 name="location-arrow" size={24} color="#fc4956" /> */}
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
    // marginBottom: 2,
    // marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecenterBtn;
