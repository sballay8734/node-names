import { ImageBackground, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/Themed";
import {
  NODE_BORDER_WIDTH,
  REG_NODE_RADIUS,
  REG_TEXT_SIZE,
  ROOT_NODE_RADIUS,
  ROOT_TEXT_SIZE,
} from "@/constants/variables";
import { INode } from "@/features/D3/types/d3Types";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { handleNodeSelect } from "../../SelectionManagement/redux/manageSelections";

import NodeWidget from "./NodeWidget";

// const NODE_COLORS = ["#4c55b7", "#099671", "#7e4db7", "#b97848", "#ad4332"];

const AnimatedBg = Animated.createAnimatedComponent(ImageBackground);

interface Props {
  node: INode;
  nodePosition: { x: number; y: number };
  centerOnNode: (node: INode) => void;
}

const image = {
  uri: "https://sa1s3optim.patientpop.com/assets/images/provider/photos/2735132.jpeg",
};

export default function NodeTapDetector({
  node,
  nodePosition,
  centerOnNode,
}: Props) {
  const dispatch = useAppDispatch();
  const selectedNode = useAppSelector((state: RootState) =>
    state.selections.selectedNodes.find((n) => node.id === n.id),
  );
  const nodeConnectionCount = useAppSelector((state: RootState) => {
    if (!node.isRoot && state.selections.secondaryConnections[node.id]) {
      return state.selections.secondaryConnections[node.id].connectionIds
        .length;
    } else {
      return null;
    }
  });

  const isSelected = selectedNode;
  const { x, y } = nodePosition;

  const {
    inactiveBgColor,
    activeBgColor,
    inactiveBorderColor,
    activeBorderColor,
  } = getColors(node);

  // !TODO: REVIEW THE TOP AND LEFT VALUES (AND REFACTOR)
  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: node.isRoot ? ROOT_NODE_RADIUS : ROOT_NODE_RADIUS / 2,
    height: node.isRoot ? ROOT_NODE_RADIUS : ROOT_NODE_RADIUS / 2,

    transform: [
      {
        translateX: node.isRoot
          ? x - ROOT_NODE_RADIUS / 2
          : x - REG_NODE_RADIUS / 2,
      },
      {
        translateY: node.isRoot
          ? y - ROOT_NODE_RADIUS / 2
          : y - REG_NODE_RADIUS / 2,
      },
    ],

    // MY STUFF
    borderWidth: NODE_BORDER_WIDTH,
    opacity: 1,
    borderRadius: 100,
    borderColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  }));

  const tap = Gesture.Tap()
    .onStart(() => {
      dispatch(handleNodeSelect(node));
      centerOnNode(node);
    })
    .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    borderColor: withTiming(
      isSelected ? activeBorderColor : inactiveBorderColor,
      {
        duration: 200,
      },
    ),
    backgroundColor: withTiming(isSelected ? activeBgColor : inactiveBgColor, {
      duration: 200,
    }),
  }));

  const animatedTextStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isSelected ? "#172924" : "#172924", {
      duration: 200,
    }),
  }));

  // TODO: Calc font size based on name length and circle size
  // THIS IS JUST A QUICK WORKAROUND
  function calcFontSize(node: INode) {
    if (node.isRoot) {
      return ROOT_TEXT_SIZE;
    } else {
      return REG_TEXT_SIZE - node.first_name.length / 2;
    }
  }

  function getColors(node: INode) {
    if (node.isRoot) {
      return {
        inactiveBgColor: "transparent",
        activeBgColor: "#66e889",
        inactiveBorderColor: "#121212",
        activeBorderColor: "#888cae",
      };
    } else {
      return {
        inactiveBgColor: "#082b21",
        activeBgColor: "#0fdba5",
        inactiveBorderColor: "transparent",
        activeBorderColor: "#16d9a5",
      };
    }
  }

  const rootImgStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 0.5 : 0.3, { duration: 200 }),
  }));

  return (
    <GestureDetector key={node.id} gesture={tap}>
      <Animated.View style={[animatedStyle, animatedStyles]}>
        {/* Trans BG VIEW */}
        <Animated.View
          style={[
            {
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor: node.isRoot ? "#0d0d0d" : "transparent",
              borderRadius: 100,
            },
          ]}
        >
          {node.isRoot && (
            <AnimatedBg
              source={image}
              style={[styles.image, rootImgStyles]}
              borderRadius={100}
            />
          )}
        </Animated.View>

        {/* Text View */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: node.isRoot ? -10 : -3,
              borderRadius: 2,
              paddingHorizontal: 3,
              paddingVertical: 1,
              backgroundColor: "#1e2152",
              borderWidth: 1,
              borderColor:
                isSelected && !node.isRoot ? "#0fdba5" : "transparent",
            },
            !node.isRoot && animatedTextStyles,
          ]}
        >
          <Text
            numberOfLines={1}
            style={{
              width: "100%",
              fontSize: calcFontSize(node),
              color: isSelected && !node.isRoot ? "#c2ffef" : "#516e66",
              fontWeight: node.isRoot ? "600" : "400",
            }}
          >
            {node.isRoot ? "ME" : node.first_name}
          </Text>
        </Animated.View>

        <NodeWidget count={nodeConnectionCount} />
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
    backgroundColor: "transparent",
  },
});

// TODO: Rootnode should be icon, others should not
// TODO: Link should also be highlighted when a node is selected
// TODO: Need option to connect to an existing node if node has no connections (it was just created)
