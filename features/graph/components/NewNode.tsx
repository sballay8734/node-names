import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";
import { HARD_CODE_RADIUS } from "./NewPerson";

interface NewNodeProps {
  node_id: number;
}

const dimensions = HARD_CODE_RADIUS * 2;

export default function NewNode({ node_id }: NewNodeProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[node_id],
  );

  const radius = node.depth === 1 ? 35 : HARD_CODE_RADIUS * 2;

  const tap = Gesture.Tap()
    .onStart(() => {
      console.log("TAPPED", node.name);
    })
    .runOnJS(true);

  const position = useDerivedValue(() => {
    return {
      x: node.x - HARD_CODE_RADIUS,
      y: node.y - HARD_CODE_RADIUS,
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.wrapper,
          {
            transform: [
              { translateX: position.value.x },
              { translateY: position.value.y },
            ],
          },
        ]}
      >
        <Animated.Text>{node.name}</Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    height: dimensions,
    width: dimensions,
    borderRadius: 100,
    // opacity: 0,
  },
});
