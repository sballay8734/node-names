import { MaterialIcons } from "@expo/vector-icons";
import { memo, useMemo } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Rule } from "@/lib/utils/getPopoverBtns";
import { useAppDispatch } from "@/store/reduxHooks";

import {
  createNewGroup,
  createNewNode,
  createSubGroupFromSelection,
  moveNode,
} from "../../redux/graphSlice";

interface Props {
  iconName: string;
  action: string;
  initialX: number;
  initialY: number;
  finalX: number;
  finalY: number;
  visibilityRule: Rule;
  selectedNodesLength: number;
  animationProgress: SharedValue<number>;
  isRootSelected: boolean;
  // isVisibleCondition: (count: number, isRootSelected: boolean) => boolean;
}

type PopoverActionMap = {
  // !TODO: TYPE THIS CORRECTLY
  [key: string]: (args: any) => any;
  // [key: string]: () => Dispatch<ActionFromReducer<any>>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const iconMap: { [key: string]: React.ReactNode } = {
  "person-add-alt-1": (
    <MaterialIcons name="person-add-alt-1" size={24} color="#170038" />
  ),
  "group-add": <MaterialIcons name="group-add" size={24} color="#170038" />,
  "group-work": <MaterialIcons name="group-work" size={24} color="#170038" />,
  "account-balance-wallet": (
    <MaterialIcons name="account-balance-wallet" size={24} color="#170038" />
  ),
  error: <MaterialIcons name="error" size={24} color="#170038" />,
};

const determineVis = (
  rule: Rule,
  count: number,
  isRootSelected: boolean,
): boolean => {
  if (isRootSelected && count === 1) {
    // Case 1: If ONLY rootNode is selected
    return rule === "any" || rule === "none";
  } else if (isRootSelected && count > 1) {
    // Case 2: If root + ANY amount is selected, NO actions should show
    return false;
  } else {
    // Default rules for other cases
    switch (rule) {
      case "any":
        return true;
      case "none":
        return count === 0;
      case "single":
        return count === 1;
      case "multiple":
        return count > 1;
      default:
        return false;
    }
  }
};

function PopoverBtn({
  iconName,
  action,
  initialX,
  initialY,
  finalX,
  finalY,
  visibilityRule,
  selectedNodesLength,
  animationProgress,
  isRootSelected,
}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const isPressed = useSharedValue<boolean>(false);
  const isVisible = useMemo(
    () => determineVis(visibilityRule, selectedNodesLength, isRootSelected),
    [visibilityRule, selectedNodesLength, isRootSelected],
  );

  const actionMap: PopoverActionMap = useMemo(
    () => ({
      createNewNode: () => dispatch(createNewNode()),
      createNewGroup: () => dispatch(createNewGroup()),
      createSubGroupFromSelection: () =>
        dispatch(createSubGroupFromSelection()),
      moveNode: () => dispatch(moveNode()),
    }),
    [dispatch],
  );

  // update position and visibility when `isVisible` changes
  const animatedStyles = useAnimatedStyle(() => {
    const x = interpolate(
      animationProgress.value,
      [0, 1],
      [initialX, finalX],
      "clamp",
    );
    const y = interpolate(
      animationProgress.value,
      [0, 1],
      [initialY, finalY],
      "clamp",
    );

    return {
      transform: [{ translateX: x }, { translateY: y }],
      opacity: withTiming(isVisible ? 1 : 0.2, {
        duration: 200,
      }),

      // !TODO: This (below) is allowing pass through (nodes behind non-visible Btns can be clicked)
      pointerEvents: isVisible ? "auto" : "none",
    };
  });

  function handlePressIn() {
    isPressed.value = true;
  }

  function handlePressOut() {
    isPressed.value = false;
  }

  return (
    <AnimatedPressable
      onPress={actionMap[action]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.btnStyles, animatedStyles]}
    >
      {iconName && (
        <View style={[styles.iconWrapper]}>{iconMap[iconName]}</View>
      )}
      {/* <Text style={textStyles}>{text}</Text> */}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btnStyles: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // padding: 6,
    borderRadius: 100,
    backgroundColor: "#f53c31",
  },
  iconWrapper: {
    backgroundColor: "#c74a44",
    borderRadius: 100,
    padding: 10,
    borderWidth: 1,
  },
});

export default memo(PopoverBtn);
