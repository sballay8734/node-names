import { Circle } from "@shopify/react-native-skia";

import { ROOT_NODE_RADIUS } from "@/constants/nodes";

interface Props {
  nodePosition: { x: number; y: number };
}

export default function RootNode({ nodePosition }: Props): React.JSX.Element {
  const { x, y } = nodePosition;

  return (
    <Circle color={"transparent"} cx={x} cy={y} r={ROOT_NODE_RADIUS / 2} />
  );
}

// !TODO: Custom fonts from EXPO are NOT working vvvvv
// const fontFamily = Platform.select({ ios: "SpaceMono", default: "serif" });
