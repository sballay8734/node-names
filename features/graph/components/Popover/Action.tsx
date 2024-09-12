import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { actionMap, ActionObj, getPosValues, iconMap } from "./maps";

export type ActionType =
  | "createNewNode"
  | "createNewGroup"
  | "createSubGroupFromSelection"
  | "moveNode";

interface ActionProps {
  action: ActionType;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TEMP_USER_NODE_ID = 1;

export default function Action({ action }: ActionProps) {
  const dispatch = useAppDispatch();
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const isActive = useAppSelector(
    (state: RootState) => state.graphData.actionBtnById[action],
  );

  console.log(isActive, action);
  const uiVisible = useAppSelector(
    (state: RootState) => state.ui.popoverIsShown,
  );

  const pos = getPosValues(windowSize)[action];
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(uiVisible ? pos.endX : pos.startX, {
            duration: 300,
          }),
        },
        {
          translateY: withTiming(uiVisible ? pos.endY : pos.startY, {
            duration: 300,
          }),
        },
      ],
      opacity: withTiming(uiVisible ? 1 : 0, {
        duration: 300,
      }),
    };
  });

  return (
    <AnimatedPressable
      onPressIn={() => console.log("PRESSING...", action)}
      onPressOut={() => dispatch(actionMap[action])}
      style={[styles.btnStyles, animatedStyles]}
    >
      {<View style={[styles.iconWrapper]}>{iconMap[action]}</View>}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btnStyles: {
    position: "absolute",
    zIndex: 1001,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
