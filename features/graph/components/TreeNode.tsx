import {
  Circle,
  Group,
  matchFont,
  Paint,
  vec,
  Text,
} from "@shopify/react-native-skia";
import * as d3 from "d3";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import {
  Node,
  TREE_NODE_DIM,
  TREE_NODE_RADIUS,
} from "@/lib/utils/newTreeGraphStrategy";

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 12,
  fontStyle: "normal",
  fontWeight: "400",
});

interface Props {
  node: d3.HierarchyPointNode<Node>;
}

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = (height - TAB_BAR_HEIGHT) / 2;

// !TODO: you CANNOT USE useSelector INSIDE OF A CANVAS

// !TODO: CLEAN ALL THIS UP
export default function TreeNode({ node }: Props) {
  const strokeWidth = 2;
  const r = (TREE_NODE_DIM - strokeWidth) / 2;
  const angle = ((node.x - 90) / 180) * Math.PI;
  const radius = node.y * 4;

  const trans = useSharedValue({
    rotate: 0,
    x: centerX,
    y: centerY,
  });

  useEffect(() => {
    const coords = [radius * Math.cos(angle), radius * Math.sin(angle)];
    // Trigger animation when component mounts
    const duration = 1000;

    trans.value = withSequence(
      (trans.value = withTiming(
        { rotate: 0, x: coords[0] + centerX, y: coords[1] + centerY },
        { duration },
      )),
    );
  }, [trans, angle, radius]);

  const transform = useDerivedValue(() => {
    return [
      { rotate: trans.value.rotate },
      { translateX: trans.value.x },
      { translateY: trans.value.y },
    ];
  });

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle r={r}>
        <Paint color={node.depth === 0 ? "#6eff81" : "#400601"} />
        <Paint color="#486c78" style="stroke" strokeWidth={strokeWidth} />
        <Paint color="#527a87" style="stroke" strokeWidth={strokeWidth / 2} />
      </Circle>
      <Text x={0} y={0} text={node.data.name} font={font} />
    </Group>
  );
}

const testGroups = [
  { group_name: "friends", id: 1, x: 373.35, y: 386.5 },
  { group_name: "work", id: 2, x: 251.14965545520946, y: 554.6943449067979 },
  { group_name: "family", id: 3, x: 53.42534454479056, y: 490.4498218679239 },
  { group_name: "school", id: 4, x: 53.42534454479056, y: 282.55017813207616 },
  { group_name: "online", id: 5, x: 251.14965545520943, y: 218.3056550932021 },
];
