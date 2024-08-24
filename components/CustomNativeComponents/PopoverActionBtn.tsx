import { MaterialIcons } from "@expo/vector-icons";
import { memo, useMemo, useRef } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

import { createNewNode } from "@/features/Graph/redux/graphManagement";
import { NodeHashObj } from "@/features/Graph/utils/getInitialNodes";
import { Rule } from "@/features/SelectionManagement/utils/determineOptions";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

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
  // isVisibleCondition: (count: number, isRootSelected: boolean) => boolean;
}

type PopoverActionMap = {
  [key: string]: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const testNode: NodeHashObj = {
  isShown: true,
  x: 600.7020822980046,
  y: 335.2613025301253,
  id: 99,
  created_at: "2024-08-08T18:09:18.182221+00:00",
  first_name: "Johnny",
  last_name: "TEST",
  maiden_name: null,
  group_id: 4,
  sex: "male",
  phonetic_name: null,
  group_name: "Family",
  date_of_birth: null,
  date_of_death: null,
  gift_ideas: null,
  preferred_name: null,
  partner_details: null,
  depth_from_user: 1,
  children_details: [
    { child_id: 1, adoptive_parents_ids: [], biological_parents_ids: [24, 23] },
    {
      child_id: 25,
      adoptive_parents_ids: [],
      biological_parents_ids: [24, 23],
    },
    {
      child_id: 26,
      adoptive_parents_ids: [],
      biological_parents_ids: [24, 23],
    },
  ],
  parent_details: null,
  shallowest_ancestor: 1,
  is_current_root: false,
};

const iconMap: { [key: string]: React.ReactNode } = {
  "person-add-alt-1": (
    <MaterialIcons name="person-add-alt-1" size={18} color="#170038" />
  ),
  "group-add": <MaterialIcons name="group-add" size={18} color="#170038" />,
  "group-work": <MaterialIcons name="group-work" size={18} color="#170038" />,
  "account-balance-wallet": (
    <MaterialIcons name="account-balance-wallet" size={18} color="#170038" />
  ),
  error: <MaterialIcons name="error" size={18} color="#170038" />,
};

const determineVis = (
  rule: Rule,
  count: number,
  // isRootSelected: boolean,
): boolean => {
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
};

function PopoverActionBtn({
  iconName,
  action,
  initialX,
  initialY,
  finalX,
  finalY,
  visibilityRule,
  selectedNodesLength,
  animationProgress,
}: Props): React.JSX.Element {
  // console.log("Re-rendering BTN");
  const dispatch = useDispatch();
  const isPressed = useSharedValue<boolean>(false);

  const isVisible = useMemo(
    () => determineVis(visibilityRule, selectedNodesLength),
    [visibilityRule, selectedNodesLength],
  );

  const actionMap: PopoverActionMap = useMemo(
    () => ({
      createNewNode: () => dispatch(createNewNode(testNode)),
      createNewGroup: () => console.log("Create new group"),
      createSubGroupFromSelection: () =>
        console.log("Create sub group from selection"),
      move: () => console.log("Move this node to another group"),
      showError: () => console.log("ERROR"),
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
      opacity: withTiming(isVisible ? 1 : 0, {
        duration: 200,
      }),
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 2,
    borderRadius: 100,
    backgroundColor: "#7448b8",
  },
  iconWrapper: {
    backgroundColor: "#845fba",
    borderRadius: 100,
    padding: 10,
    borderWidth: 1,
  },
});

export default memo(PopoverActionBtn);
