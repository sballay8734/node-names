import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";

import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";
import { PositionedPerson } from "@/utils/positionGraphElements";

import NodeTapDetector from "./NodeTapDetector";
import { useGestures } from "./hooks/useGestures";

interface Props {
  centerOnNode: (node: PositionedPerson) => void;
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
  const finalizedNodes = useAppSelector(
    (state: RootState) => state.selections.nodes,
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
      {finalizedNodes &&
        finalizedNodes.map((node) => {
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
    backgroundColor: "rgba(150, 4, 255, 0.3)",
    top: 0,
    left: 0,
    flex: 1,
  },
});
