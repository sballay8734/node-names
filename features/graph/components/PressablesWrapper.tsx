import { StyleSheet } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import NewNode from "./NewNode";
import { INITIAL_SCALE } from "@/lib/hooks/useGestures";

export default function PressablesWrapper() {
  const allNodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );

  if (!allNodeIds || allNodeIds.length === 0) return null;

  return (
    <Animated.View style={styles.wrapper}>
      {allNodeIds.map((id) => (
        <NewNode key={id} node_id={id} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    // pointerEvents: "box-none",
  },
});
