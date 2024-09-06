import {
  Circle,
  Group,
  matchFont,
  Paint,
  Text,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  NODE_BORDER_WIDTH,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
  TAB_BAR_HEIGHT,
} from "@/lib/constants/styles";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface NodeSvgProps {
  id: number;
}

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = (height - TAB_BAR_HEIGHT) / 2;

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 12,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function NodeSvg({ id }: NodeSvgProps) {
  const node = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[id],
  );

  const radius = node.depth === 1 ? ROOT_NODE_RADIUS : REG_NODE_RADIUS;
  const color = node.depth === 1 ? "#fccfff" : "#400601";

  function getFontSize(text: string): { xOffset: number; yOffset: number } {
    const fontSize = font.measureText(text);

    const xOffset = -fontSize.width / 2 - fontSize.x;
    const yOffset = fontSize.height / 4; // TODO: Not a perfect center

    return { xOffset, yOffset };
  }

  const trans = useSharedValue({
    rotate: 0,
    x: centerX,
    y: centerY,
  });

  useEffect(() => {
    trans.value = withTiming(
      { rotate: 0, x: node.x, y: node.y },
      { duration: 500, easing: Easing.inOut(Easing.cubic) },
    );
  }, [node.x, node.y, trans]);

  const transform = useDerivedValue(() => {
    return [
      { rotate: trans.value.rotate },
      { translateX: trans.value.x },
      { translateY: trans.value.y },
    ];
  });

  const { xOffset, yOffset } = getFontSize(node.name);

  if (!node) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle r={radius}>
        <Paint color={color} />
        <Paint color="#486c78" style="stroke" strokeWidth={NODE_BORDER_WIDTH} />
      </Circle>
      {/* <Text x={xOffset} y={yOffset} text={node.name} font={font} /> */}
      <Text x={xOffset} y={yOffset} text={node.name} font={font} />
    </Group>
  );
}
