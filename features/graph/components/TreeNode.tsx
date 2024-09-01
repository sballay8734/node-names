import {
  Circle,
  Group,
  matchFont,
  Paint,
  vec,
  Text,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
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
export default function TreeNode({ node }: Props) {
  const strokeWidth = 2;
  const r = (TREE_NODE_DIM - strokeWidth) / 2;

  const position = useSharedValue({ x: centerX, y: centerY });
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Trigger animation when component mounts
    rotation.value = withTiming(
      ((node.x * 180) / Math.PI - 90) * (Math.PI / 180),
      { duration: 500 },
    );
    position.value = withTiming(
      {
        x: node.x + centerX,
        y: node.y + centerY,
      },
      { duration: 500 },
    );
  }, [position, node.x, node.y, rotation]);

  const transform = useDerivedValue(() => {
    return [{ translateY: position.value.y }, { translateX: position.value.x }];
  });

  return (
    <Group transform={transform}>
      <Circle r={r}>
        <Paint color={node.depth === 0 ? "#6eff81" : "#400601"} />
        <Paint color="#486c78" style="stroke" strokeWidth={strokeWidth} />
        <Paint color="#527a87" style="stroke" strokeWidth={strokeWidth / 2} />
      </Circle>
      <Text x={0} y={0} text={node.data.name} font={font} />
    </Group>
  );
}
