import { Circle, Group, matchFont } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

import { Node, TREE_NODE_RADIUS } from "@/lib/utils/newTreeGraphStrategy";
import { useDerivedValue } from "react-native-reanimated";
import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 20,
  fontStyle: "normal",
  fontWeight: "400",
});

interface Props {
  node: d3.HierarchyPointNode<Node>;
}

const { width, height } = Dimensions.get("window");

// !TODO: you CANNOT USE useSelector INSIDE OF A CANVAS
export default function TreeNode({ node }: Props) {
  const nodeX = node.x;
  const nodeY = node.y;
  const centerX = width / 2;
  const centerY = (height - TAB_BAR_HEIGHT) / 2;

  const transform = useDerivedValue(() => {
    return [
      { translateX: centerX },
      { translateY: centerY },
      // { scale: scale.value },
    ];
  });

  if (node.depth !== 0) return null;

  console.log(node.data.name, node.x, node.y);

  return (
    <Group transform={transform}>
      <Circle
        r={TREE_NODE_RADIUS}
        color={node.depth === 0 ? "red" : "#400601"}
        cy={nodeY}
        cx={nodeX}
      />
      {/* <Text x={nodeX} y={nodeY} text={node.data.name} font={font} /> */}
    </Group>
  );
}
