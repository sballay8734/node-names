import { View, StyleSheet, Text, Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { createNewNode } from "../../redux/graphSlice";
import { handleSheet, hideSheet } from "../../redux/uiSlice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const EL_BORDER_RADIUS = 3;

export default function NewNodeData() {
  const dispatch = useAppDispatch();
  const isShown = useAppSelector((state: RootState) => state.ui.sheetIsShown);

  // !TODO: translateY value should NOT be fixed
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isShown ? 1 : 0, { duration: 200 }),
      transform: [
        { translateY: withTiming(isShown ? 0 : 600, { duration: 200 }) },
      ],
      pointerEvents: isShown ? "auto" : "none",
    };
  });

  function handleClose() {
    dispatch(hideSheet());
  }

  function handleCreate() {
    dispatch(createNewNode());
    dispatch(handleSheet());
  }

  return (
    <Animated.View style={[styles.wrapper, animatedStyles]}>
      <View style={styles.formWrapper}>
        <View style={styles.formElements}>
          <TextInput placeholder="Name" style={styles.inputWrapper}></TextInput>
          <TextInput
            placeholder="Birthday"
            style={styles.inputWrapper}
          ></TextInput>
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
        <Text>X</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 500,
    backgroundColor: "#312d2c",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  formWrapper: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  formElements: {
    width: "100%",
    borderWidth: 1,
    borderColor: "purple",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
    borderRadius: EL_BORDER_RADIUS,
  },
  closeBtn: {
    position: "absolute",
    top: -25,
    right: 0,
    borderRadius: 100,
    width: 50,
    height: 50,
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
