import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";

import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";
import { PositionedNode } from "@/utils/getNodePositions";

import NodeTapDetector from "./NodeTapDetector";

interface Props {
  centerOnNode: (node: PositionedNode) => void;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  scale: SharedValue<number>;
}

export default function Nodes({
  centerOnNode,
  translateX,
  translateY,
  scale,
}: Props): React.JSX.Element {
  const nodes = useAppSelector(
    (state: RootState) => state.manageGraph.userNodes,
  );

  const transform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  return (
    <Animated.View
      style={{
        ...styles.tapWrapper,
        transform: transform,
      }}
    >
      {nodes &&
        nodes.map((node) => {
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
