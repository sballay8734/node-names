import { Circle, Group } from "@shopify/react-native-skia";

import { REG_NODE_RADIUS } from "@/constants/nodes";

interface Props {
  nodePosition: { x: number; y: number };
}

export default function Node({ nodePosition }: Props): React.JSX.Element {
  const { x, y } = nodePosition;
  return (
    <Group>
      <Circle color={"transparent"} cx={x} cy={y} r={REG_NODE_RADIUS / 2} />
    </Group>
  );
}
