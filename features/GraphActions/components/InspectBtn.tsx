import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { View } from "@/components/Themed";
import { useNewDataLoad } from "@/features/Graph/utils/useNewDataLoad";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

export default function InspectBtn(): React.JSX.Element {
  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);
  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );
  const selectedNodeCount = useAppSelector(
    (state: RootState) => state.selections.selectedNodes.length,
  );
  const rootNodeIsSelected = useAppSelector((state: RootState) => {
    return (
      state.selections.selectedNodes.length === 1 &&
      !state.selections.selectedNodes[0].source_node_ids === true
    );
  });
  const { updateRootId } = useNewDataLoad();

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
  }

  function handlePressOut() {
    if (
      selectedNodeCount === 1 &&
      !rootNodeIsSelected &&
      !longPressRef.current
    ) {
      updateRootId(selectedNodes[0].id);
    }
    isPressed.value = false;
  }

  function handleLongPress() {
    longPressRef.current = true;
  }

  const inspectBtnStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        selectedNodeCount === 1 && !rootNodeIsSelected
          ? 1
          : selectedNodeCount === 1 && rootNodeIsSelected
          ? 0.3
          : selectedNodeCount > 1
          ? 0.3
          : 0,
        { duration: 200 },
      ),
      pointerEvents:
        selectedNodeCount === 1 && !rootNodeIsSelected ? "auto" : "none",
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

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      style={[styles.recenterButton, inspectBtnStyles]}
    >
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.scan]}>
          <AnimatedIcon
            name="magnify-scan"
            size={24}
            animatedProps={animatedProps}
          />
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
