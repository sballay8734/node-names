import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ViewStyle } from "react-native";

import { Text } from "@/components/Themed";
import { INode } from "./types/graphTypes";
import {
  NODE_BORDER_WIDTH,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/constants/nodes";

interface Props {
  node: INode;
  nodePosition: { x: number; y: number };
}

export default function NodeTapDetector({ node, nodePosition }: Props) {
  const pressed = useSharedValue<boolean>(false);

  const { x, y } = nodePosition;
  const radius = node.rootNode ? ROOT_NODE_RADIUS / 2 : REG_NODE_RADIUS / 2;

  const {
    inactiveBgColor,
    activeBgColor,
    inactiveBorderColor,
    activeBorderColor,
  } = getColors(node);

  const detectorStyle: ViewStyle = {
    position: "absolute",
    top: -radius,
    left: -radius,
    width: radius * 2,
    height: radius * 2,
    transform: [{ translateX: x }, { translateY: y }],
    borderWidth: NODE_BORDER_WIDTH,
    opacity: 1,
    borderRadius: 100, // full (to make circle)

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  };

  const tap = Gesture.Tap().onStart(() => {
    pressed.value = !pressed.value;
  });

  const animatedStyles = useAnimatedStyle(() => ({
    borderColor: withTiming(
      pressed.value ? activeBorderColor : inactiveBorderColor,
      {
        duration: 100,
      },
    ),
    backgroundColor: withTiming(
      pressed.value ? activeBgColor : inactiveBgColor,
      {
        duration: 100,
      },
    ),
  }));

  // TODO: Calc font size based on name length and circle size
  // THIS IS JUST A QUICK WORKAROUND
  function calcFontSize(node: INode) {
    if (node.rootNode) {
      return 20;
    } else {
      return 12 - node.firstName.length / 2;
    }
  }

  function getColors(node: INode) {
    if (node.rootNode) {
      return {
        inactiveBgColor: "#525050",
        activeBgColor: "#66e889",
        inactiveBorderColor: "#121212",
        activeBorderColor: "#4fb869",
      };
    } else {
      return {
        inactiveBgColor: "#525050",
        activeBgColor: "#66dfe8",
        inactiveBorderColor: "#121212",
        activeBorderColor: "#4faab8",
      };
    }
  }

  return (
    <GestureDetector key={node.id} gesture={tap}>
      <Animated.View style={[detectorStyle, animatedStyles]}>
        <Text
          numberOfLines={1}
          style={{ color: "black", fontSize: calcFontSize(node) }}
        >
          {node.firstName}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

// !TODO: You should ONLY be able to select multiple if in multiselect mode (I think)
