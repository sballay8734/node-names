import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDataLoad } from "@/features/Graph/utils/useDataLoad";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

export default function BackToUserBtn(): React.JSX.Element {
  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);
  const insets = useSafeAreaInsets();

  const { updateRootId } = useDataLoad();

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
  }

  function handlePressOut() {
    // TODO: Replace this with the user's id and NOT a hardcoded value
    updateRootId(1);
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
      style={[styles.backToUserBtn, { marginTop: insets.top + 10 }]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.scan]}>
          {/* <AnimatedIcon
            name="magnify-scan"
            size={24}
            animatedProps={animatedProps}
          /> */}
          <Text style={{ color: "white" }}>ME</Text>
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
