import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { PositionedNode } from "@/features/D3/types/d3Types";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import NodeTapDetector from "./NodeTapDetector";

interface Props {
  centerOnNode: (node: PositionedNode) => void;
}

export default function Nodes({ centerOnNode }: Props): React.JSX.Element {
  const nodes = useAppSelector(
    (state: RootState) => state.manageGraph.userNodes,
  );

  return (
    <Animated.View
      style={{
        ...styles.tapWrapper,
        // transform: transform,
      }}
    >
      {nodes &&
        Object.values(nodes).map((node) => {
          const { x, y } = node;

          if (x && y) {
            return (
              <NodeTapDetector
                key={node.id}
                centerOnNode={centerOnNode}
                node={node}
                nodePosition={{ x, y }}
              />
            );
          } else {
            return null;
          }
        })}
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
