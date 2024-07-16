import { rootNodeRad } from "@/constants/nodes";
import { Circle, Group, Text as SkiaText } from "@shopify/react-native-skia";

export interface INode {
  id: number;
  rootNode: boolean;
  firstName: string;
  lastName: string;
  group: string | null;
  sex: string;
}

interface Props {
  node: INode;
  index: number;
  totalNodes: number;
}

export default function Node({
  node,
  index,
  totalNodes,
}: Props): React.JSX.Element {
  // word circle around root node
  function getYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * rootNodeRad + windowSize.windowCenterY;
  }

  function getXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * rootNodeRad + windowSize.windowCenterX;
  }

  return (
    <Group key={node.id} style={"fill"}>
      <Circle
        color={"blue"}
        cx={getXValue(index)}
        cy={getYValue(index)}
        r={regRad / 2}
      />
      <SkiaText
        x={getXValue(index) - font.measureText(node.firstName).width / 2}
        y={getYValue(index) + font.measureText(node.firstName).height / 2 / 2}
        text={node.firstName}
        font={font}
        style={"fill"}
      />
    </Group>
  );
}
