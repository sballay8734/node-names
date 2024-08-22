import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useDataLoad } from "@/features/Graph/utils/useDataLoad";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";
import { INITIAL_SCALE, useGestures } from "@/features/Graph/hooks/useGestures";

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
  // this will update the root and trigger a new reload of all nodes/connections
  // !TODO: You should store the userRoot somewhere so that when you switch back to the user, you don't have to run all those functions again
  const { updateRootId, newRootNode } = useDataLoad();

  const rootNodeIsSelected = useAppSelector((state: RootState) => {
    return (
      newRootNode &&
      state.selections.selectedNodes.length === 1 &&
      state.selections.selectedNodes[0].id === newRootNode.id
    );
  });

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
  }

  function handlePressOut() {
    if (selectedNodeCount === 1 && selectedNodes[0].depth_from_user > 2) return;

    if (
      selectedNodeCount === 1 &&
      !rootNodeIsSelected &&
      !longPressRef.current &&
      // TODO: This line currently disallows inspecting deeper nested nodes until you fix the data structure to simplify the logic for handling it
      selectedNodes[0].depth_from_user < 2
    ) {
      console.log("TODO: UPDATE_ROOT_ID");
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
        selectedNodeCount === 1 &&
          !rootNodeIsSelected &&
          selectedNodes[0].shallowest_ancestor === 1
          ? 1
          : (selectedNodeCount === 1 && rootNodeIsSelected) ||
            (selectedNodeCount === 1 &&
              selectedNodes[0].shallowest_ancestor !== 1)
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

const activeRoot = {
  children_ids: ["10"],
  created_at: "2024-07-20T14:08:06.754277+00:00",
  date_of_birth: null,
  date_of_death: null,
  first_name: "Aaron",
  gift_ideas: ["Baby thing1", "Babything2", "Workout app"],
  group_id: 2,
  group_name: "Best Friends",
  id: 2,
  last_name: "Mackenzie",
  maiden_name: null,
  partner_id: 9,
  partner_type: "spouse",
  phonetic_name: "Ah run",
  preferred_name: "Amac",
  sex: "male",
  source_node_ids: ["1"],
};

const test = {
  children_ids: ["10"],
  created_at: "2024-07-20T14:08:06.754277+00:00",
  date_of_birth: null,
  date_of_death: null,
  first_name: "Aaron",
  gift_ideas: ["Baby thing1", "Babything2", "Workout app"],
  group_id: 2,
  group_name: "Best Friends",
  hiddenConnections: 0,
  id: 2,
  last_name: "Mackenzie",
  maiden_name: null,
  partner_id: 9,
  partner_type: "spouse",
  phonetic_name: "Ah run",
  preferred_name: "Amac",
  sex: "male",
  shownConnections: 0,
  source_node_ids: ["1"],
};
