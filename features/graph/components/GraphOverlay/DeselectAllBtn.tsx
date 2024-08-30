import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { deselectAll } from "../../redux/uiSlice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

export default function DeselectAllBtn(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);
  const selectedNodesCount = useAppSelector((state: RootState) => {
    return Object.values(state.graphData.nodes.byId).filter(
      (node) => node.node_status === "active",
    ).length;
  });

  const inspectBtnStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(selectedNodesCount >= 1 ? 1 : 0, {
        duration: 200,
      }),
      pointerEvents: selectedNodesCount >= 1 ? "auto" : "none",
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
        <Animated.View style={[styles.iconWrapper]}>
          <AnimatedIcon
            name="deselect"
            size={24}
            animatedProps={animatedProps}
          />
        </Animated.View>
      </View>
      <Animated.View style={[styles.widget]}>
        <Text style={{ fontWeight: "bold", fontSize: 9 }}>
          {selectedNodesCount}
        </Text>
      </Animated.View>
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
    position: "relative",
  },
  iconWrapper: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  widget: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    backgroundColor: "#ba1818",
    borderRadius: 3,
    minHeight: 17,
    minWidth: 17,
    top: -4,
    right: -2,
  },
});

// TODO: opacity of widget should be 0 if no nodes are selected

// TODO: When saving, I think selectedNodes gets reset/cleared which is why saving the file removes the btn. THIS MAY BE THE REASON FOR OTHER MINOR BUGS YOU'RE SEEING ALSO. SAVING CLEARS SOME STATE

// mTODO: Press and hold will reveal menu that can take you to any selected node?
