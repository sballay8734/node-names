import React, { useContext, useRef } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import PlusIcon from "@/components/PlusIcon";
import { GestureContextType } from "@/lib/context/gestures";
import { WindowSize } from "@/lib/types/misc";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";
import { handlePopover, showSheet } from "../../redux/uiSlice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  gestures: GestureContextType;
  windowSize: WindowSize;
}

export default function AddBtn({
  gestures,
  windowSize,
}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const isPressed = useSharedValue<boolean>(false);
  const sheetIsShown = useAppSelector(
    (state: RootState) => state.ui.sheetIsShown,
  );
  const theme = useContext(CustomThemeContext);
  const longPressRef = useRef<boolean>(false);

  const handlePressIn = () => {
    isPressed.value = true;
    longPressRef.current = false;
  };

  const handleLongPress = () => {
    longPressRef.current = true;
  };

  const handlePressOut = () => {
    isPressed.value = false;

    if (!longPressRef.current) {
      dispatch(showSheet());
    }
  };

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
        { backgroundColor: theme.primary, borderColor: theme.btnBaseSelected },
        animatedStyles,
      ]}
    >
      <Animated.View>
        <PlusIcon color={theme.btnBaseSelected} size={35} />
      </Animated.View>
    </AnimatedPressable>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "absolute",
    bottom: 10,
    right: 10,
    borderWidth: 1,
    borderColor: "#232a2b",
    borderRadius: 100,
    padding: 10,
  },
});
