import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { REDUX_ACTIONS } from "@/lib/constants/actions";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import Action from "./Action";

export default function Popover(): React.JSX.Element {
  const uiVisible = useAppSelector(
    (state: RootState) => state.ui.popoverIsShown,
  );

  return (
    <Animated.View
      style={[
        {
          ...styles.wrapperStyles,
          pointerEvents: uiVisible ? "box-none" : "none",
        },
      ]}
    >
      {REDUX_ACTIONS.map((action) => {
        return <Action key={action} action={action} />;
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
