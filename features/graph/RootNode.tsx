import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import { WindowSize } from "@/hooks/useWindowSize";
import {
  Circle,
  Group,
  matchFont,
  Text as SkiaText,
} from "@shopify/react-native-skia";
import { Platform } from "react-native";
import { INode } from "./types/graphTypes";

interface Props {
  node: INode;
  windowSize: WindowSize;
}

// CONSTANTS ******************************************************************

export default function RootNode({
  node,
  windowSize,
}: Props): React.JSX.Element {
  // Font config ***************************************************************
  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });

  // TODO: Font size should be based on node width
  const fontStyle = {
    fontFamily,
    fontSize: 12,
  };
  const font = matchFont(fontStyle);

  return (
    <Group>
      <Circle
        // color={"red"}
        cx={windowSize.windowCenterX}
        cy={windowSize.windowCenterY}
        r={ROOT_NODE_RADIUS / 2}
      />
      {/* <SkiaText
        color={"black"}
        x={
          windowSize.windowCenterX - font.measureText(node.firstName).width / 2
        }
        // mTODO: vv This is NOT exact center close enough for now
        y={
          windowSize.windowCenterY +
          font.measureText(node.firstName).height / 2 / 2
        }
        text={node.firstName}
        font={font}
        strokeWidth={2}
        style={"fill"}
      /> */}
    </Group>
  );
}

// !TODO: Custom fonts from EXPO are NOT working vvvvv
// const fontFamily = Platform.select({ ios: "SpaceMono", default: "serif" });
