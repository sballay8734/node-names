import { Canvas, Group } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";
import { useAppSelector } from "@/hooks/reduxHooks";
import { WindowSize } from "@/hooks/useWindowSize";
import { RootState } from "@/store/store";

import Link from "./Link";

interface Props {
  windowSize: WindowSize;
}

function isPositionedNode(node: any): node is PositionedNode {
  return typeof node === "object" && typeof node.id === "number";
}

export default function LinksCanvas({ windowSize }: Props): React.JSX.Element {
  const links = useAppSelector(
    (state: RootState) => state.manageGraph.userLinks,
  );
  const selectedNodeId = useAppSelector(
    (state: RootState) => state.selections.selectedNodes[0]?.id,
  );
  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );

  function show(link: PositionedLink) {
    const nodeIds = selectedNodes.map((n) => n.id);

    // type guard
    if (typeof link.source === "object" && "id" in link.source) {
      return nodeIds.includes(link.source.id);
    }

    return false;
  }

  // const svgTransform = useDerivedValue(() => [
  //   { translateX: translateX.value },
  //   { translateY: translateY.value },
  //   { scale: scale.value },
  // ]);

  const origin = useDerivedValue(() => ({
    x: windowSize.width / 2,
    y: windowSize.height / 2,
  }));

  return (
    <Canvas style={styles.canvas}>
      <Group origin={origin}>
        {links &&
          links.map((link: PositionedLink) => {
            const shouldShow = isPositionedNode(link.source) && show(link);
            return <Link key={link.id} link={link} shouldShow={shouldShow} />;
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

// !TODO: Move this shouldShow logic to the link itself because you're rendering ALL links everytime a node is selected
