import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import { REG_NODE_RADIUS } from "@/constants/nodes";
import { WindowSize } from "@/hooks/useWindowSize";
import { Circle, Group } from "@shopify/react-native-skia";

interface Props {
  index: number;
  totalNodes: number;
  windowSize: WindowSize;
}

export default function Node({
  index,
  totalNodes,
  windowSize,
}: Props): React.JSX.Element {
  // word circle around root node
  function getYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterY;
  }

  function getXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterX;
  }

  return (
    <Group>
      <Circle
        color={"transparent"}
        cx={getXValue(index)}
        cy={getYValue(index)}
        r={REG_NODE_RADIUS / 2}
      />
    </Group>
  );
}
