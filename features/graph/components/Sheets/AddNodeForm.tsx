import { useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  GestureResponderEvent,
  TouchableWithoutFeedback,
} from "react-native";
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

  const formHeight = height * 0.8;

  // !TODO: Center the node above the form so user can see what's happening
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isShown ? 1 : 0, { duration: 300 }),
      // transform: [
      //   { translateY: withTiming(isShown ? 0 : 0, { duration: 300 }) },
      // ],
      pointerEvents: isShown ? "auto" : "none",
    };
  });

  function handleClose(e: GestureResponderEvent) {
    console.log(typeof e.target);
    // if (e.target)
    dispatch(hideSheet());
  }

  function handleCreate() {
    // return;
    dispatch(addRootGroup());
    dispatch(handleSheet());
  }

  return (
    <AnimatedPressable
      style={[
        styles.wrapper,
        animatedStyles,
        { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      ]}
      pointerEvents={"box-only"}
      onPress={(e) => handleClose(e)}
    >
      <TouchableWithoutFeedback>
        <View style={[styles.formWrapper, { backgroundColor: theme.btnBase }]}>
          <View style={styles.formElements}>
            <TextInput placeholder="Name" style={styles.inputWrapper}>
              NEW NODE GROUP: {activeRootGroup ? activeRootGroup.name : "ROOT"}
            </TextInput>
            <TextInput
              placeholder="Source if source is node"
              style={styles.inputWrapper}
            >
              NEW NODE SOURCE:
            </TextInput>
            <TextInput
              placeholder="First Name"
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder="Last Name"
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder="Sex"
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder="Phonetic Spelling"
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder="Birthday"
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder="Phonetic Spelling"
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder="Phonetic Spelling"
              style={styles.inputWrapper}
            ></TextInput>
          </View>
          <AnimatedPressable onPress={handleCreate} style={styles.submitBtn}>
            <Text>Create</Text>
          </AnimatedPressable>
        </View>
      </TouchableWithoutFeedback>
      {/* <AnimatedPressable onPress={handleClose} style={styles.closeBtn}>
        <Text>CLOSE</Text>
      </AnimatedPressable> */}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 10,
  },
  formWrapper: {
    padding: 10,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 10,
    gap: 10,
  },
  formElements: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  inputWrapper: {
    width: "100%",
    height: 50,
    padding: 5,
    borderRadius: EL_BORDER_RADIUS,
    borderColor: "#404040",
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
    borderRadius: EL_BORDER_RADIUS,
  },
  closeBtn: {
    position: "absolute",
    bottom: 0,
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
