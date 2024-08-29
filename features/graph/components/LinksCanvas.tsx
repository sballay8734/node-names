import { Canvas, Group } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

import { useAppSelector } from "@/lib/constants/reduxHooks";
import { WindowSize } from "@/lib/hooks/useWindowSize";
import { RootState } from "@/store/store";

import Link from "./Link";

import { PositionedLink, PositionedNode } from "@/features/D3/types/d3Types";

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
  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );

  function show(link: PositionedLink) {
    // type guard
    if (typeof link.source === "object" && "id" in link.source) {
      return selectedNodes.includes(link.source.id);
    }

    return false;
  }

  const origin = useDerivedValue(() => ({
    x: windowSize.width / 2,
    y: windowSize.height / 2,
  }));

  return (
    <Canvas
      style={[
        styles.canvas,
        {
          // TODO: ADD THIS BACK TO SEE HOW IT WORKS
          // width: windowSize.width * 2,
          width: windowSize.width,
          height: windowSize.height,
        },
      ]}
    >
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
    overflow: "visible",
    backgroundColor: "rgba(155, 155, 0, 0.1)",
  },
});

// !TODO: Move this shouldShow logic to the link itself because you're rendering ALL links everytime a node is selected
