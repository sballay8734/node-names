import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { View } from "@/components/Themed";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function InspectBtn(): React.JSX.Element {
  const selectedNodeCount = useAppSelector(
    (state: RootState) => state.selections.selectedNodes.length,
  );

  // REMOVE: Temporary until you track if rootNode is selected
  const rootNodeIsSelected = false;

  const inspectBtnStyles = useAnimatedStyle(() => {
    return {
      opacity: selectedNodeCount === 1 && !rootNodeIsSelected ? 1 : 0,
      pointerEvents:
        selectedNodeCount === 1 && !rootNodeIsSelected ? "auto" : "none",
    };
  });

  function handlePressIn() {
    console.log("Inspect Btn");
    // !TODO: This is where you should fire the function to get all primary connections of the selectedNode
  }

  function handlePressOut() {
    console.log("Probably not needed");
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.recenterButton, inspectBtnStyles]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.scan]}>
          <MaterialCommunityIcons name="magnify-scan" size={24} color="white" />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  recenterButton: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    right: 10,
    // height: ARROW_BTN_RADIUS * 2,
    // width: ARROW_BTN_RADIUS * 2,
    padding: 10,
    borderRadius: 100,
    borderColor: "#232a2b",
    borderWidth: 1,
    backgroundColor: "transparent",
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
