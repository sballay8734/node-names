import { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { useAppSelector } from "@/lib/constants/reduxHooks";
import { UiVertex } from "@/lib/types/graph";
import { RootState } from "@/store/store";

import NodeTapDetector from "./NodeTapDetector";

interface Props {
  centerOnNode: (node: UiVertex) => void;
}

function NodesWrapper({ centerOnNode }: Props): React.JSX.Element {
  const vertexIds = useAppSelector(
    (state: RootState) => state.graphData.vertices.allIds,
  );

  const memoizedNodes = useMemo(() => {
    return (
      vertexIds &&
      vertexIds.map((id) => (
        <NodeTapDetector key={id} centerOnNode={centerOnNode} vertexId={id} />
      ))
    );
  }, [vertexIds, centerOnNode]);

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
