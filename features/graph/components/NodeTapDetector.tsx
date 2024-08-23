import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { nodeBgMap } from "@/constants/Colors";
import { REG_NODE_RADIUS, ROOT_NODE_RADIUS } from "@/constants/variables";
import { PositionedNode } from "@/features/D3/types/d3Types";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { handleNodeSelect } from "../../SelectionManagement/redux/manageSelections";
import { calcFontSize } from "../helpers/calcFontSize";
import { getColors } from "../helpers/getColors";
import { NodeHashObj } from "../utils/getInitialNodes";

// const NODE_COLORS = ["#4c55b7", "#099671", "#7e4db7", "#b97848", "#ad4332"];

const AnimatedBg = Animated.createAnimatedComponent(ImageBackground);

interface Props {
  node: NodeHashObj;
  centerOnNode: (node: PositionedNode) => void;
}

const image = {
  uri: "https://sa1s3optim.patientpop.com/assets/images/provider/photos/2735132.jpeg",
};

export default function NodeTapDetector({ node, centerOnNode }: Props) {
  const dispatch = useAppDispatch();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const windowSize = useAppSelector((state: RootState) => state.windowSize);

  const { x, y } = node;
  const position = useSharedValue({ x, y });

  // opacity for animating in and out
  const opacity = useSharedValue(0);

  // Transition progress for smooth root node transition
  const transitionProgress = useSharedValue(node.is_current_root ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    transitionProgress.value = withTiming(node.is_current_root ? 1 : 0, {
      duration: 500,
    });

    return () => {
      opacity.value = withTiming(0, { duration: 500 });
    };
  }, [node.is_current_root, opacity, transitionProgress, position]);

  useEffect(() => {
    position.value = withTiming({ x, y }, { duration: 500 });
  }, [x, y, position]);

  const {
    inactiveBgColor,
    activeBgColor,
    inactiveBorderColor,
    activeBorderColor,
  } = getColors(node);

  const animatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(
      transitionProgress.value,
      [0, 1],
      [REG_NODE_RADIUS / 2, ROOT_NODE_RADIUS / 2],
    );

    return {
      position: "absolute",
      width: radius * 2,
      height: radius * 2,
      borderWidth: 2,
      borderRadius: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      borderColor: withTiming(
        isSelected ? activeBorderColor : inactiveBorderColor,
        { duration: 200 },
      ),
      backgroundColor: withTiming(
        isSelected ? activeBgColor : inactiveBgColor,
        { duration: 200 },
      ),
      // opacity: opacity.value,
      opacity: withTiming(node.isShown ? 1 : 0, { duration: 300 }),
      transform: [
        {
          translateX: node.is_current_root
            ? windowSize.windowCenterX - ROOT_NODE_RADIUS / 2
            : position.value.x - radius,
        },
        {
          translateY: node.is_current_root
            ? windowSize.windowCenterY - ROOT_NODE_RADIUS / 2
            : position.value.y - radius,
        },
      ],
    };
  });

  const animatedTextStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isSelected ? "#172924" : "#172924", {
      duration: 200,
    }),
  }));

  const rootImgStyles = useAnimatedStyle(() => ({
    opacity: interpolate(transitionProgress.value, [0, 1], [0, 0.5]),
  }));

  const tap = Gesture.Tap()
    .onStart(() => {
      // this line below is basically pointer events: "none"
      if (node.isShown === false) return;

      setIsSelected(!isSelected);

      dispatch(handleNodeSelect(node));
      // centerOnNode(node);
    })
    .runOnJS(true);

  // if (node.is_current_root) {
  //   console.log(node.first_name);
  //   console.log(node.id);
  // }

  return (
    <GestureDetector key={node.id} gesture={tap}>
      <Animated.View style={[animatedStyle]}>
        <Animated.View
          style={[
            {
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor: node.is_current_root ? "#0d0d0d" : "transparent",
              borderRadius: 100,
              borderWidth: 1,
            },
          ]}
        >
          <AnimatedBg
            source={image}
            style={[styles.image, rootImgStyles]}
            borderRadius={100}
          />
        </Animated.View>

        {/* Text View */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: node.is_current_root ? -10 : -3,
              borderRadius: 2,
              paddingHorizontal: 3,
              paddingVertical: 1,
              backgroundColor: !node.group_id
                ? "#1e2152"
                : nodeBgMap[node.group_id],
              borderWidth: 1,
              borderColor:
                isSelected && !node.is_current_root ? "#0fdba5" : "transparent",
            },
            !node.is_current_root && animatedTextStyles,
          ]}
        >
          <Text
            numberOfLines={1}
            style={{
              width: "100%",
              fontSize: calcFontSize(node),
              color:
                isSelected && !node.is_current_root ? "#c2ffef" : "#516e66",
              fontWeight: node.is_current_root ? "600" : "400",
            }}
          >
            {node.is_current_root ? node.first_name : node.first_name}
          </Text>
        </Animated.View>
        {/* 
        <NodeWidget hiddenConnections={node.hiddenConnections} /> */}
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
