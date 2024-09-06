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
  GROUP_NODE_RADIUS,
  NODE_BORDER_WIDTH,
  TAB_BAR_HEIGHT,
} from "@/lib/constants/styles";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";
import { NodeStatus } from "@/lib/types/graph";

interface GroupSvgProps {
  id: number;
}

const testFlop = true;

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = (height - TAB_BAR_HEIGHT) / 2;

const colorMap: { [key: string]: string } = {
  active: "rgba(48, 245, 107, 1)",
  parent_active: "rgba(55, 163, 88, 1)",
  inactive: "rgba(21, 80, 39, 1)",
};

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 22,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function GroupSvg({ id }: GroupSvgProps) {
  const group = useAppSelector(
    (state: RootState) => state.graphData.groups.byId[id],
  );
  const sourceStatus = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.byId[group.source_id].node_status,
  );

  const color = colorMap[sourceStatus];

  const trans = useSharedValue({
    rotate: 0,
    x: centerX,
    y: centerY,
  });

  function getFontSize(text: string): { xOffset: number; yOffset: number } {
    const fontSize = font.measureText(text);

    const xOffset = -fontSize.width / 2 - fontSize.x;
    const yOffset = fontSize.height / 4; // TODO: Not a perfect center

    return { xOffset, yOffset };
  }

  useEffect(() => {
    trans.value = withTiming(
      { rotate: 0, x: group.x, y: group.y },
      { duration: 500, easing: Easing.inOut(Easing.cubic) },
    );
  }, [group.x, group.y, trans]);

  const transform = useDerivedValue(() => {
    return [
      { rotate: trans.value.rotate },
      { translateX: trans.value.x },
      { translateY: trans.value.y },
    ];
  });

  const { xOffset, yOffset } = getFontSize(group.group_name);

  if (!group) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle r={GROUP_NODE_RADIUS}>
        <Paint color={color} />
        <Paint color="#486c78" style="stroke" strokeWidth={NODE_BORDER_WIDTH} />
      </Circle>
      <Text x={xOffset} y={yOffset} text={group.group_name} font={font} />
    </Group>
  );
}
