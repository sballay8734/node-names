import {
  Circle,
  Group,
  matchFont,
  Paint,
  Text,
} from "@shopify/react-native-skia";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

import { getNodeStyles } from "@/lib/constants/Colors";
import {
  GROUP_NODE_RADIUS,
  NODE_BORDER_WIDTH,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { UiNode } from "@/lib/types/graph";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import { selectNodeStatus } from "../redux/graphSlice";

interface GroupNodeSvgProps {
  node: UiNode;
}

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 12,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function SvgGroupNode({ node }: GroupNodeSvgProps) {
  const {
    width,
    height,
    windowCenterX: centerX,
    windowCenterY: centerY,
  } = useAppSelector((state: RootState) => state.windowSize);

  const nodeStatus = useAppSelector((state: RootState) => {
    if (node.depth === 1) {
      return state.graphData.nodes.byId[node.id].node_status;
    } else if (node.node_status === "active") {
      return node.node_status;
    } else {
      return selectNodeStatus(state, node.id);
    }
  });

  const depth = node.depth; // Assuming `node.depth` gives you the depth level
  const { fillColor, borderColor, textColor } = getNodeStyles(
    nodeStatus,
    depth,
  );
  const radius = node.depth === 1 ? ROOT_NODE_RADIUS : GROUP_NODE_RADIUS;

  const trans = useSharedValue({
    rotate: 0,
    x: centerX,
    y: centerY,
  });
  const transform = useDerivedValue(() => {
    return [
      { rotate: trans.value.rotate },
      { translateX: node.x },
      { translateY: node.y },
    ];
  });
  const { xOffset, yOffset } = getFontSize(node.name);

  function getFontSize(text: string): { xOffset: number; yOffset: number } {
    const fontSize = font.measureText(text);

    const xOffset = -fontSize.width / 2 - fontSize.x;
    const yOffset = fontSize.height / 4; // TODO: Not a perfect center

    return { xOffset, yOffset };
  }

  // this will animate the nodes on mount if you replace translateX and translateY in transform with node.x and node.y
  // useEffect(() => {
  //   trans.value = withTiming(
  //     { rotate: 0, x: node.x, y: node.y },
  //     { duration: 500, easing: Easing.inOut(Easing.cubic) },
  //   );
  // }, [node.x, node.y, trans]);

  if (!node) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle r={radius}>
        <Paint color={fillColor} />
        <Paint
          color={borderColor}
          style="stroke"
          strokeWidth={NODE_BORDER_WIDTH}
        />
      </Circle>
      {/* <Text x={xOffset} y={yOffset} text={node.name} font={font} /> */}
      <Text
        x={xOffset}
        y={yOffset}
        text={node.name}
        font={font}
        color={textColor}
      />
    </Group>
  );
}
