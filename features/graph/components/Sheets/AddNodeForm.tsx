import { useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { addRootGroup } from "../../redux/graphSlice";
import {
  FormKey,
  handleSheet,
  hideSheet,
  updateInput,
} from "../../redux/uiSlice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const EL_BORDER_RADIUS = 3;

// REMOVE: These will need to be pulled from user settings
export type RootGroup = "Friends" | "Online" | "School" | "Work" | "Family";

export default function AddNodeForm() {
  const dispatch = useAppDispatch();
  const isShown = useAppSelector((state: RootState) => state.ui.sheetIsShown);
  const { height } = useAppSelector((state: RootState) => state.windowSize);
  const theme = useContext(CustomThemeContext);
  const activeRootGroup = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.activeRootGroupId &&
      state.graphData.nodes.byId[state.graphData.nodes.activeRootGroupId],
  );
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const formState = useAppSelector((state: RootState) => state.ui.formInfo);

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

  function handleClose() {
    dispatch(hideSheet());
  }

  function handleCreate() {
    // return;
    dispatch(
      addRootGroup({ newGroupName: formState.newGroupName, windowSize }),
    );
    dispatch(handleSheet());
  }

  function handleReduxUpdate(key: FormKey, text: string) {
    dispatch(updateInput({ key, value: text }));
  }

  return (
    <AnimatedPressable
      style={[
        styles.wrapper,
        animatedStyles,
        { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      ]}
      pointerEvents={"box-only"}
      onPress={handleClose}
    >
      <TouchableWithoutFeedback>
        <View style={[styles.formWrapper, { backgroundColor: theme.btnBase }]}>
          <View style={styles.formElements}>
            <TextInput
              placeholder="Relation Type (DROPDOWN)"
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder={`Source Group: (DROPDOWN) ${
                activeRootGroup ? activeRootGroup.name : "ROOT"
              }`}
              style={styles.inputWrapper}
            ></TextInput>
            <TextInput
              placeholder="Source Node (SEARCH/FILTER)"
              style={styles.inputWrapper}
            ></TextInput>
            {/* !TODO: You don't need this many for the initial add. */}
            <TextInput
              placeholder="New Group Name"
              style={styles.inputWrapper}
              maxLength={40}
              onChangeText={(text) => handleReduxUpdate("newGroupName", text)}
              autoComplete="off"
              value={formState.newGroupName}
            ></TextInput>
            <TextInput
              placeholder="First Name"
              style={styles.inputWrapper}
              maxLength={40}
              onChangeText={(text) => handleReduxUpdate("firstName", text)}
              autoComplete="off"
              value={formState.firstName}
            ></TextInput>
            <TextInput
              placeholder="Last Name"
              style={styles.inputWrapper}
              maxLength={40}
              onChangeText={(text) => handleReduxUpdate("lastName", text)}
              autoComplete="off"
              value={formState.lastName}
            ></TextInput>
          </View>
          <AnimatedPressable onPress={handleCreate} style={styles.submitBtn}>
            <Text>CREATE NODE</Text>
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
    paddingLeft: 10,
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
