import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { Node, TREE_NODE_DIM } from "@/lib/utils/newTreeGraphStrategy";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  link: d3.HierarchyPointLink<Node>;
}

export default function TreeLink({ link }: Props) {
  const sourcePos = useSharedValue({ x: link.source.x, y: link.source.y });
  const targetPos = useSharedValue({ x: link.target.x, y: link.target.y });

  useEffect(() => {
    sourcePos.value = withTiming(
      { x: link.source.x, y: link.source.y },
      { duration: 500 },
    );
    targetPos.value = withTiming(
      { x: link.target.x, y: link.target.y },
      { duration: 500 },
    );
  }, [
    link.source.x,
    link.source.y,
    link.target.x,
    link.target.y,
    sourcePos,
    targetPos,
  ]);

  const animatedProps = useAnimatedProps(() => {
    const sourceX = Math.cos(sourcePos.value.x) * sourcePos.value.y;
    const sourceY = Math.sin(sourcePos.value.x) * sourcePos.value.y;
    const targetX = Math.cos(targetPos.value.x) * targetPos.value.y;
    const targetY = Math.sin(targetPos.value.x) * targetPos.value.y;

    return {
      d: `M${sourceX},${sourceY}L${targetX},${targetY}`,
    };
  });

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <AnimatedPath
        animatedProps={animatedProps}
        stroke="white"
        strokeWidth={3}
        fill="none"
      />
    </Svg>
  );
}
