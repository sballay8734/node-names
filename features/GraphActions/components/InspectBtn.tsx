import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  getSelectedVertices,
  getSoloSelectedVertex,
  swapRootVertex,
} from "@/features/Graph/redux/graphDataManagement";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

interface Props {
  centerOnRoot: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

export default function InspectBtn({ centerOnRoot }: Props): React.JSX.Element {
  const dispatch = useAppDispatch();

  const isPressed = useSharedValue(false);
  const longPressRef = useRef(false);

  // memoized with create selector
  const selectedVertices = useAppSelector(getSelectedVertices);
  const soloSelectedVertex = useAppSelector(getSoloSelectedVertex);

  const activeRootNodeId = useAppSelector(
    (state: RootState) => state.graphData.vertices.activeRootId,
  );

  const isButtonEnabled =
    selectedVertices.length === 1 && soloSelectedVertex !== activeRootNodeId;
  const isButtonVisible = selectedVertices.length > 0;
  const isButtonFaded =
    selectedVertices.length > 1 ||
    (selectedVertices.length === 1 && soloSelectedVertex === activeRootNodeId);

  function handlePressIn() {
    isPressed.value = true;
    longPressRef.current = false;
  }

  function handlePressOut() {
    if (!isButtonEnabled || longPressRef.current) {
      isPressed.value = false;
      return;
    }

    if (!activeRootNodeId) {
      console.log("NO ACTIVE ROOT (InspectBtn)");
      return;
    }

    if (soloSelectedVertex) {
      dispatch(
        swapRootVertex({
          newRootId: soloSelectedVertex.id,
          oldRootId: activeRootNodeId,
        }),
      );
      centerOnRoot();
    } else {
      console.error(`Vertex not found`);
    }

    isPressed.value = false;
  }

  function handleLongPress() {
    longPressRef.current = true;
  }

  const inspectBtnStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isButtonVisible ? (isButtonFaded ? 0.3 : 1) : 0, {
        duration: 200,
      }),
      pointerEvents: isButtonEnabled ? "auto" : "none",
      backgroundColor: withTiming(
        isPressed.value ? "rgba(15,15,15,1)" : "rgba(0,0,0,1)",
        { duration: 200 },
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
