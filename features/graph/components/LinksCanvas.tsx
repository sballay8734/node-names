import { Canvas, Group } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

import { useAppSelector } from "@/hooks/reduxHooks";
import { WindowSize } from "@/hooks/useWindowSize";
import { RootState } from "@/store/store";
import { IPositionedLink, IPositionedNode } from "@/utils/getNodePositions";

import Link from "./Link";

interface Props {
  windowSize: WindowSize;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  scale: SharedValue<number>;
}

function isPositionedNode(node: any): node is IPositionedNode {
  return typeof node === "object" && typeof node.id === "number";
}

export default function LinksCanvas({
  windowSize,
  translateX,
  translateY,
  scale,
}: Props): React.JSX.Element {
  const links = useAppSelector(
    (state: RootState) => state.manageGraph.userLinks,
  );
  const selectedNodeId = useAppSelector(
    (state: RootState) => state.selections.selectedNodes[0]?.id,
  );

  const svgTransform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  const origin = useDerivedValue(() => ({
    x: windowSize.width / 2,
    y: windowSize.height / 2,
  }));

  return (
    <Canvas style={styles.canvas}>
      <Group origin={origin} transform={svgTransform}>
        {links &&
          links.map((link: IPositionedLink) => {
            const shouldShow =
              isPositionedNode(link.source) &&
              selectedNodeId === link.source.id;
            return (
              <Link key={link.index} link={link} shouldShow={shouldShow} />
            );
          })}
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    // backgroundColor: "rgba(155, 155, 0, 0.3)",
  },
});
