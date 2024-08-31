import { Circle, Group, SkiaProps } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { Node, TREE_NODE_DIM } from "@/lib/utils/newTreeGraphStrategy";
import { forwardRef, useEffect } from "react";

interface Props {
  node: d3.HierarchyPointNode<Node>;
}

// !TODO: you CANNOT USE useSelector INSIDE OF A CANVAS
export default function TreeNode({ node }: Props) {
  const { height, width } = useWindowDimensions();
  const position = useSharedValue({
    cx: width / 2,
    cy: (height - TAB_BAR_HEIGHT) / 2,
  });

  // const transform = useDerivedValue(() => {
  //   const angle = (position.value.cx * 180) / Math.PI - 90;
  //   return [{ rotate: angle }, { translateY: final.value.cy }];
  // });

  return (
    <Group>
      <Circle
        // transform={[]}
        r={TREE_NODE_DIM / 2}
        color={node.depth === 0 ? "red" : "#400601"}
        cx={position.value.cx}
        cy={position.value.cy}
      />
    </Group>
  );
}
