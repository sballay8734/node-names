import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import { WindowSize } from "@/hooks/useWindowSize";
import { Circle, Group } from "@shopify/react-native-skia";
import { INode } from "./types/graphTypes";

interface Props {
  node: INode;
  windowSize: WindowSize;
}

// CONSTANTS ******************************************************************

export default function RootNode({ windowSize }: Props): React.JSX.Element {
  return (
    <Group>
      <Circle
        color={"transparent"}
        cx={windowSize.windowCenterX}
        cy={windowSize.windowCenterY}
        r={ROOT_NODE_RADIUS / 2}
      />
    </Group>
  );
}

// !TODO: Custom fonts from EXPO are NOT working vvvvv
// const fontFamily = Platform.select({ ios: "SpaceMono", default: "serif" });
