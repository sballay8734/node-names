import { ImageBackground, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { nodeBgMap } from "@/constants/Colors";
import {
  REG_NODE_RADIUS,
  REG_TEXT_SIZE,
  ROOT_NODE_RADIUS,
  ROOT_TEXT_SIZE,
} from "@/constants/variables";
import { PositionedNode } from "@/features/D3/types/d3Types";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { handleNodeSelect } from "../../SelectionManagement/redux/manageSelections";
import { INode2 } from "../redux/graphManagement";

import NodeWidget from "./NodeWidget";

// const NODE_COLORS = ["#4c55b7", "#099671", "#7e4db7", "#b97848", "#ad4332"];

const AnimatedBg = Animated.createAnimatedComponent(ImageBackground);

interface Props {
  node: INode2;
  nodePosition: { x: number; y: number };
  centerOnNode: (node: PositionedNode) => void;
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
  const rootNodeId = useAppSelector(
    (state: RootState) =>
      state.manageGraph.activeRootNode && state.manageGraph.activeRootNode.id,
  );

  const isSelected = selectedNode;
  const { x, y } = nodePosition;

  const {
    inactiveBgColor,
    activeBgColor,
    inactiveBorderColor,
    activeBorderColor,
  } = getColors(node);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: node.id === rootNodeId ? ROOT_NODE_RADIUS : ROOT_NODE_RADIUS / 2,
    height: node.id === rootNodeId ? ROOT_NODE_RADIUS : ROOT_NODE_RADIUS / 2,

    transform: [
      {
        translateX:
          node.id === rootNodeId
            ? x - ROOT_NODE_RADIUS / 2
            : x - REG_NODE_RADIUS / 2,
      },
      {
        translateY:
          node.id === rootNodeId
            ? y - ROOT_NODE_RADIUS / 2
            : y - REG_NODE_RADIUS / 2,
      },
    ],

    // MY STUFF
    borderWidth: 2,
    opacity: 1,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",

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

  const rootImgStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 0.5 : 0.3, { duration: 200 }),
  }));

  const tap = Gesture.Tap()
    .onStart(() => {
      // console.log(node);
      dispatch(handleNodeSelect(node));
      centerOnNode(node);
    })
    .runOnJS(true);

  // TODO: Calc font size based on name length and circle size
  // THIS IS JUST A QUICK WORKAROUND
  function calcFontSize(node: INode2) {
    if (node.id === rootNodeId) {
      return ROOT_TEXT_SIZE;
    } else {
      return REG_TEXT_SIZE - node.first_name.length / 2;
    }
  }

  function getColors(node: INode2) {
    if (node.id === rootNodeId) {
      return {
        inactiveBgColor: "transparent",
        sourceActiveBg: "",
        activeBgColor: "#66e889",
        inactiveBorderColor: "#121212",
        activeBorderColor: "rgba(245, 240, 196, 1)",
      };
    } else {
      return {
        inactiveBgColor: !node.group_id ? "#1e2152" : nodeBgMap[node.group_id],
        sourceActiveBg: !node.group_id
          ? "#1e2152"
          : nodeBgMap[node.group_id * 11],
        activeBgColor: !node.group_id
          ? "#1e2152"
          : nodeBgMap[node.group_id * 111],
        inactiveBorderColor: "transparent",
        activeBorderColor: "rgba(245, 240, 196, 1)",
      };
    }
  }

  return (
    <GestureDetector key={node.id} gesture={tap}>
      <Animated.View style={[animatedStyle]}>
        {/* Trans BG VIEW */}
        <Animated.View
          style={[
            {
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor:
                node.id === rootNodeId ? "#0d0d0d" : "transparent",
              borderRadius: 100,
              borderWidth: 1,
            },
          ]}
        >
          {node.id === rootNodeId && (
            <AnimatedBg
              source={image}
              style={[styles.image, rootImgStyles]}
              borderRadius={100}
              // imageStyle={{ borderWidth: 2 }}
            />
          )}
        </Animated.View>

        {/* Text View */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: node.id === rootNodeId ? -10 : -3,
              borderRadius: 2,
              paddingHorizontal: 3,
              paddingVertical: 1,
              backgroundColor: !node.group_id
                ? "#1e2152"
                : nodeBgMap[node.group_id],
              borderWidth: 1,
              borderColor:
                isSelected && node.id !== rootNodeId
                  ? "#0fdba5"
                  : "transparent",
            },
            node.id !== rootNodeId && animatedTextStyles,
          ]}
        >
          <Text
            numberOfLines={1}
            style={{
              width: "100%",
              fontSize: calcFontSize(node),
              color:
                isSelected && node.id !== rootNodeId ? "#c2ffef" : "#516e66",
              fontWeight: node.id === rootNodeId ? "600" : "400",
            }}
          >
            {node.id === rootNodeId ? node.first_name : node.first_name}
          </Text>
        </Animated.View>

        <NodeWidget hiddenConnections={node.hiddenConnections} />
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
