import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

import { View } from "@/components/Themed";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { deselectAll } from "../manageSelections/redux/manageSelections";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

export default function DeselectAllBtn(): React.JSX.Element {
  const dispatch = useDispatch();
  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);
  const selectedNodeCount = useAppSelector(
    (state: RootState) => state.selections.selectedNodes.length,
  );

  const inspectBtnStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(selectedNodeCount >= 1 ? 1 : 0, { duration: 200 }),
      pointerEvents: selectedNodeCount >= 1 ? "auto" : "none",
      backgroundColor: withTiming(
        isPressed.value ? "rgba(15,15,15,1)" : "rgba(0,0,0,1)",
        {
          duration: 200,
        },
      ),
    };
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      color: withTiming(isPressed.value ? "#878787" : "#ffffff", {
        duration: 200,
      }),
    };
  });

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
  }

  function handlePressOut() {
    if (!longPressRef.current) {
      dispatch(deselectAll());
      isPressed.value = false;
    }
    isPressed.value = false;
  }

  function handleLongPress() {
    longPressRef.current = true;
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      style={[styles.deselectBtn, inspectBtnStyles]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.scan]}>
          <AnimatedIcon
            name="deselect"
            size={24}
            animatedProps={animatedProps}
          />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  deselectBtn: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bottom: 70,
    right: 10,
    // height: ARROW_BTN_RADIUS * 2,
    // width: ARROW_BTN_RADIUS * 2,
    padding: 10,
    borderRadius: 100,
    borderColor: "#232a2b",
    borderWidth: 1,
    backgroundColor: "green",
  },
  buttonContent: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  scan: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

// TODO: When saving, I think selectedNodes gets reset/cleared which is why saving the file removes the btn. THIS MAY BE THE REASON FOR OTHER MINOR BUGS YOU'RE SEEING ALSO. SAVING CLEARS SOME STATE
