import { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { UiNode } from "@/lib/types/graph";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import NodeTapDetector from "./NodeTapDetector";

interface Props {
  centerOnNode: (node: UiNode) => void;
}

function NodesWrapper({ centerOnNode }: Props): React.JSX.Element {
  const nodeIds = useAppSelector(
    (state: RootState) => state.graphData.nodes.allIds,
  );

  const memoizedNodes = useMemo(() => {
    return (
      nodeIds &&
      nodeIds.map((id) => (
        <NodeTapDetector key={id} centerOnNode={centerOnNode} nodeId={id} />
      ))
    );
  }, [nodeIds, centerOnNode]);

  return (
    <Animated.View
      style={{
        ...styles.tapWrapper,
      }}
    >
      {memoizedNodes}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tapWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    // backgroundColor: "rgba(150, 4, 255, 0.3)",
    top: 0,
    left: 0,
    flex: 1,
  },
});

export default memo(NodesWrapper);
