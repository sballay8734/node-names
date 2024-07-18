import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ImageBackground, ViewStyle, StyleSheet } from "react-native";

import { Text } from "@/components/Themed";
import { INode } from "./types/graphTypes";
import {
  NODE_BORDER_WIDTH,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/constants/nodes";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { handleNodeSelect } from "../manageSelections/redux/manageSelections";
import { RootState } from "@/store/store";

const NODE_COLORS = ["#4c55b7", "#099671", "#7e4db7", "#b97848", "#ad4332"];

interface Props {
  node: INode;
  nodePosition: { x: number; y: number };
}

const image = {
  uri: "https://sa1s3optim.patientpop.com/assets/images/provider/photos/2735132.jpeg",
};

export default function NodeTapDetector({ node, nodePosition }: Props) {
  const dispatch = useAppDispatch();
  const selectedNode = useAppSelector((state: RootState) =>
    state.selections.selectedNodes.find((n) => node.id === n.id),
  );

  const pressed = selectedNode;

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

  // !TODO: Remove runOnJS if possible when changing to redux
  // REVIEW: runOnJS is necessary here but not performant
  const tap = Gesture.Tap()
    .onStart(() => {
      dispatch(handleNodeSelect(node));
      // dispatch(hidePopover());
    })
    .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    borderColor: withTiming(pressed ? activeBorderColor : inactiveBorderColor, {
      duration: 100,
    }),
    backgroundColor: withTiming(pressed ? activeBgColor : inactiveBgColor, {
      duration: 100,
    }),
  }));

  const animatedTextStyles = useAnimatedStyle(() => ({
    opacity: withTiming(pressed ? 1 : 0.4, {
      duration: 100,
    }),
  }));

  // TODO: Calc font size based on name length and circle size
  // THIS IS JUST A QUICK WORKAROUND
  function calcFontSize(node: INode) {
    if (node.rootNode) {
      return 18;
    } else {
      return 12 - node.firstName.length / 2;
    }
  }

  function getColors(node: INode) {
    if (node.rootNode) {
      return {
        inactiveBgColor: "transparent",
        activeBgColor: "#66e889",
        inactiveBorderColor: "#121212",
        activeBorderColor: "#888cae",
      };
    } else {
      return {
        inactiveBgColor: "transparent",
        activeBgColor: "#66dfe8",
        inactiveBorderColor: "#121212",
        activeBorderColor: "#888cae",
      };
    }
  }

  return (
    <GestureDetector key={node.id} gesture={tap}>
      <Animated.View style={[detectorStyle, animatedStyles]}>
        {/* Trans BG VIEW */}
        <Animated.View
          style={[
            {
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor: node.rootNode
                ? "#0d0d0d"
                : NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
              borderRadius: 100,
            },
            !node.rootNode && animatedTextStyles,
          ]}
        >
          {node.rootNode && (
            <ImageBackground
              source={image}
              style={styles.image}
              borderRadius={100}
              // background image opacity
              // TODO: opacity here vvvv is not animated
              imageStyle={{ opacity: pressed ? 1 : 0.3 }}
            />
          )}
        </Animated.View>

        {/* Text View */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: node.rootNode ? -10 : -5,
              borderRadius: 2,
              paddingHorizontal: 6,
              paddingVertical: 2,
              backgroundColor: "#1e2152",
              borderWidth: 1,
              borderColor: pressed || node.rootNode ? "#232e3a" : "transparent",
            },
            !node.rootNode && animatedTextStyles,
          ]}
        >
          <Text
            numberOfLines={1}
            style={{
              width: "100%",
              fontSize: calcFontSize(node),
              color: "white",
              fontWeight: node.rootNode ? "600" : "400",
            }}
          >
            {node.rootNode ? "ME" : node.firstName}
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0",
  },
});

// TODO: Rootnode should be icon, others should not
// TODO: Link should also be highlighted when a node is selected
// TODO: Need option to connect to an existing node if node has no connections (it was just created)
