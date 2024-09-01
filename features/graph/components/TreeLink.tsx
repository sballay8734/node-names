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
  const angleS = ((link.source.x - 90) / 180) * Math.PI;
  const radiusS = link.source.y * 4;
  const coordsS = [radiusS * Math.cos(angleS), radiusS * Math.sin(angleS)];

  const angleT = ((link.target.x - 90) / 180) * Math.PI;
  const radiusT = link.target.y * 4;
  const coordsT = [radiusT * Math.cos(angleT), radiusT * Math.sin(angleT)];

  const sourceX = coordsS[0] + centerX;
  const sourceY = coordsS[1] + centerY;
  const targetX = coordsT[0] + centerX;
  const targetY = coordsT[1] + centerY;

  // console.log("SOURCE:", sourceX, sourceY);
  // console.log("TARGET:", targetX, targetY);

  const path = Skia.Path.Make();
  path.moveTo(sourceX, sourceY);
  path.lineTo(targetX, targetY);
  path.close();

  return (
    <Group origin={{ x: centerX, y: centerY }}>
      <Path
        path={path}
        color="#96a9b0"
        strokeWidth={2}
        strokeJoin={"round"}
        strokeCap={"round"}
        style={"stroke"}
      />
    </Group>
  );
}
