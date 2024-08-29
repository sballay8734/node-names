import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import PopoverActionBtn from "@/features/Graph/components/GraphOverlay/PopoverActionBtn";
import { useAppSelector } from "@/lib/constants/reduxHooks";
import { POPOVER_OPTIONS } from "@/lib/utils/determineOptions";
import { RootState } from "@/store/store";

import { getSelectedVertices } from "../../redux/graphSlice";

export default function Popover(): React.JSX.Element {
  // console.log("Re-rendering Popover");
  const isVisible = useAppSelector(
    (state: RootState) => state.selections.popoverIsShown,
  );

  // why am i not getting auto complete on vertex here?
  const selectedVertices = useAppSelector(getSelectedVertices);

  const activeRootNodeId = useAppSelector(
    (state: RootState) => state.graphData.vertices.activeRootId,
  );

  const isRootSelected = useAppSelector(
    (state: RootState) => state.graphData.userId === activeRootNodeId,
  );

  const animationProgress = useSharedValue(0);

  // animate progress when visibility changes
  useEffect(() => {
    animationProgress.value = withTiming(isVisible ? 1 : 0, { duration: 300 });
  }, [isVisible, animationProgress]);

  const viewStyles = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
  }));

  return (
    <Animated.View
      style={[
        {
          ...styles.wrapperStyles,
          pointerEvents: isVisible ? "box-none" : "none",
        },
        viewStyles,
      ]}
    >
      {POPOVER_OPTIONS.map((o) => {
        // DO SOME LOGIC HERE SO THAT PROPS ARE NOT OBJECTS
        return (
          <PopoverActionBtn
            key={o.text}
            iconName={o.iconName}
            action={o.action}
            initialX={o.initialX}
            initialY={o.initialY}
            finalX={o.finalX}
            finalY={o.finalY}
            visibilityRule={o.visibilityRule}
            selectedVerticesLength={selectedVertices.length}
            animationProgress={animationProgress}
            isRootSelected={isRootSelected}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapperStyles: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    alignSelf: "center",
    // backgroundColor: "rgba(155, 155, 0, 0.1)",
    backgroundColor: "transparent",
    zIndex: 1000,
    top: 0,
    pointerEvents: "box-none",
  },
});

// ALL SCENARIOS ***************************************************************
// 1. No nodes are selected (createGroup OR createNode) - root as default source
// 2. 1 node selected (createNode AND moveNode) - selected node as default source

// 3. more than 1 node selected
// ----- groupNodes (createsSubGroup inside group with selected nodes)
// ----- createNode (where the new node will connect to all selected nodes [think creating a child of two parents])
