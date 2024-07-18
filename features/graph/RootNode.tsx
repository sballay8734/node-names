import { Circle, Group } from "@shopify/react-native-skia";

import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import { WindowSize } from "@/hooks/useWindowSize";

interface Props {
  nodePosition: { x: number; y: number };
}

export default function RootNode({ nodePosition }: Props): React.JSX.Element {
  const { x, y } = nodePosition;

  return (
    <Group>
      <Circle color={"purple"} cx={x} cy={y} r={ROOT_NODE_RADIUS / 2} />
    </Group>
  );
}

// !TODO: Custom fonts from EXPO are NOT working vvvvv
// const fontFamily = Platform.select({ ios: "SpaceMono", default: "serif" });
