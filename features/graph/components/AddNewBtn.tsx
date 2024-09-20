import { useContext, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import PlusIcon from "@/components/PlusIcon";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { handlePopover } from "../redux/uiSlice";
import { RootState } from "@/store/store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AddNewBtn() {
  const dispatch = useAppDispatch();
  const sheetIsShown = useAppSelector(
    (state: RootState) => state.ui.sheetIsShown,
  );
  const theme = useContext(CustomThemeContext);
  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
    console.log("pressed");
  }

  function handleLongPress() {
    longPressRef.current = true;
  }

  function handlePressOut() {
    isPressed.value = false;

    // if it's not a long press
    if (!longPressRef.current) {
      dispatch(handlePopover());
    }
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(sheetIsShown ? 0 : isPressed.value ? 0.8 : 1, {
        duration: 100,
      }),
      pointerEvents: sheetIsShown ? "none" : "auto",
    };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      style={[
        styles.wrapper,
        { backgroundColor: theme.btnBaseSelected },
        animatedStyles,
      ]}
    >
      <View>
        <Animated.View>
          <PlusIcon color={theme.primary} size={44} />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -35 }],
    borderRadius: 100,
  },
});
