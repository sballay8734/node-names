import { useContext } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { addRootGroup } from "../../redux/graphSlice";
import { handleSheet, hideSheet } from "../../redux/uiSlice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const EL_BORDER_RADIUS = 3;

export default function AddNodeForm() {
  const dispatch = useAppDispatch();
  const isShown = useAppSelector((state: RootState) => state.ui.sheetIsShown);
  const { height } = useAppSelector((state: RootState) => state.windowSize);
  const insets = useSafeAreaInsets();
  const theme = useContext(CustomThemeContext);
  const activeRootGroup = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.activeRootGroupId &&
      state.graphData.nodes.byId[state.graphData.nodes.activeRootGroupId],
  );

  const formHeight = height * 0.75;

  // !TODO: translateY value should NOT be fixed
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isShown ? 1 : 0, { duration: 300 }),
      transform: [
        { translateY: withTiming(isShown ? 0 : -800, { duration: 300 }) },
      ],
      pointerEvents: isShown ? "auto" : "none",
    };
  });

  function handleClose() {
    dispatch(hideSheet());
  }

  function handleCreate() {
    dispatch(addRootGroup());
    dispatch(handleSheet());
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        animatedStyles,
        { height: formHeight || 600, backgroundColor: theme.btnBase },
      ]}
    >
      <View style={[styles.formWrapper, { paddingTop: insets.top }]}>
        <View style={styles.formElements}>
          {/* NEW NODE SOURCE */}
          <TextInput placeholder="Name" style={styles.inputWrapper}>
            NEW NODE GROUP: {activeRootGroup ? activeRootGroup.name : "ROOT"}
          </TextInput>
          <TextInput
            placeholder="Birthday"
            style={styles.inputWrapper}
            // TODO: Could be ROOT (if it's a new root group) or a ROOT GROUP (if it's a new node) or a NODE / NODE GROUP (if it's a node connected to a node)
          >
            NEW NODE SOURCE:{" "}
          </TextInput>
          <TextInput
            placeholder="Description"
            style={styles.inputWrapper}
          ></TextInput>
        </View>
        <AnimatedPressable onPress={handleCreate} style={styles.submitBtn}>
          <Text>Create</Text>
        </AnimatedPressable>
      </View>
      <AnimatedPressable onPress={handleClose} style={styles.closeBtn}>
        <Text>CLOSE</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    height: 700,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  formWrapper: {
    width: "100%",
    height: "100%",
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  formElements: {
    width: "100%",
    borderWidth: 1,
    borderColor: "purple",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  inputWrapper: {
    width: "100%",
    height: 50,
    padding: 5,
    borderRadius: EL_BORDER_RADIUS,
    borderColor: "green",
    borderWidth: 1,
    color: "white",
  },
  submitBtn: {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
    marginBottom: 25,
    borderRadius: EL_BORDER_RADIUS,
  },
  closeBtn: {
    position: "absolute",
    bottom: -25,
    right: 25,
    borderRadius: 100,
    paddingHorizontal: 25,
    paddingVertical: 15,
    // width: 50,
    // height: 50,
    backgroundColor: "#ff5252",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
