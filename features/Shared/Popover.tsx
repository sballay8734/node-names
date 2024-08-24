import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import PopoverActionBtn from "@/components/CustomNativeComponents/PopoverActionBtn";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { POPOVER_OPTIONS } from "../SelectionManagement/utils/determineOptions";

export default function Popover(): React.JSX.Element {
  console.log("Re-rendering Popover");
  const isVisible = useAppSelector(
    (state: RootState) => state.selections.popoverIsShown,
  );

  const viewStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible ? 1 : 0, { duration: 200 }),
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
            key={o.text} // string
            iconName={o.iconName} // string
            action={o.action} // string
            initialX={o.initialX}
            initialY={o.initialY}
            finalX={o.finalX}
            finalY={o.finalY}
            visibilityRule={o.visibilityRule}
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
    backgroundColor: "rgba(155, 155, 0, 0.1)",
    zIndex: 1000,
    top: 0,
    pointerEvents: "box-none",
  },
});

// ALL SCENARIOS ***************************************************************
// 1. No nodes are selected (createGroup OR createNode) - root as default source
// 2. 1 node selected (createNode) - selected node as default source

// 3. more than 1 node selected
// ----- groupNodes (createsSubGroup inside group with selected nodes)
// ----- createNode (where the new node will connect to all selected nodes [think creating a child of two parents])
