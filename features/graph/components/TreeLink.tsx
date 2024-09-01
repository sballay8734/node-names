import { Group, Path, Skia } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { Node, TREE_NODE_RADIUS } from "@/lib/utils/newTreeGraphStrategy";

// const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  link: d3.HierarchyPointLink<Node>;
}

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = (height - TAB_BAR_HEIGHT) / 2;

export default function TreeLink({ link }: Props) {
  const sourceX = link.source.x + centerX;
  const sourceY = link.source.y + centerY;
  const targetX = link.target.x + centerX;
  const targetY = link.target.y + centerY;

  console.log("SOURCE:", sourceX, sourceY);
  console.log("TARGET:", targetX, targetY);

  const path = Skia.Path.Make();
  path.moveTo(sourceX, sourceY);
  path.lineTo(targetX, targetY);
  path.close();

  return (
    <Path
      path={path}
      color="#96a9b0"
      strokeWidth={2}
      strokeJoin={"round"}
      strokeCap={"round"}
      style={"stroke"}
    />
  );
}
