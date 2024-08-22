import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDataLoad } from "@/features/Graph/utils/useDataLoad";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

// REMOVE: hardcoded for testing
const userId = 1;

export default function BackToUserBtn(): React.JSX.Element {
  const { updateRootId, rootNodeId } = useDataLoad();
  const activeRootNode = useAppSelector(
    (state: RootState) => state.manageGraph.activeRootNode,
  );
  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);
  const insets = useSafeAreaInsets();

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
  }

  function handlePressOut() {
    // TODO: Replace this with the user's id and NOT a hardcoded value

    isPressed.value = false;
    updateRootId(1);
  }

  function handleLongPress() {
    longPressRef.current = true;
  }

  const btnStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        activeRootNode && activeRootNode.id !== userId ? 1 : 0,
        { duration: 200 },
      ),
      pointerEvents:
        activeRootNode && activeRootNode.id === userId ? "none" : "auto",
      backgroundColor: withTiming(
        isPressed.value ? "rgba(15,15,15,1)" : "rgba(0,0,0,1)",
        {
          duration: 100,
        },
      ),
    };
  });

  const textStyles = useAnimatedStyle(() => {
    return {
      color: withTiming(isPressed.value ? "#ffffff" : "#878787", {
        duration: 100,
      }),
    };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      style={[styles.backToUserBtn, { marginTop: insets.top + 10 }, btnStyles]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.scan]}>
          {/* <AnimatedIcon
            name="magnify-scan"
            size={24}
            animatedProps={animatedProps}
          /> */}
          <Animated.Text style={[textStyles]}>ME</Animated.Text>
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  backToUserBtn: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 20,
    // height: ARROW_BTN_RADIUS * 2,
    // width: ARROW_BTN_RADIUS * 2,
    padding: 10,
    borderRadius: 100,
    borderColor: "#232a2b",
    borderWidth: 1,
    backgroundColor: "black",
  },
  buttonContent: {
    // backgroundColor: "transparent",
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
