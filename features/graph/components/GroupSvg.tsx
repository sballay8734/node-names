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

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { PositionedGroup } from "@/lib/utils/positionGraphEls";

interface GroupSvgProps {
  group: PositionedGroup;
}

// REMOVE:
const HARD_CODE_RADIUS = 50;
const HARD_CODE_SW = 2;
const testFlop = true;
const HARD_CODE_SHIFT_X = -12;
const HARD_CODE_SHIFT_Y = 3;

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = (height - TAB_BAR_HEIGHT) / 2;

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 10,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function NodeGroup({ group }: GroupSvgProps) {
  const trans = useSharedValue({
    rotate: 0,
    x: centerX,
    y: centerY,
  });

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
  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle r={HARD_CODE_RADIUS}>
        <Paint color={testFlop ? "#6eff81" : "#400601"} />
        <Paint color="#486c78" style="stroke" strokeWidth={HARD_CODE_SW} />
        <Paint color="#527a87" style="stroke" strokeWidth={HARD_CODE_SW / 2} />
      </Circle>
      <Text
        x={HARD_CODE_SHIFT_X}
        y={HARD_CODE_SHIFT_Y}
        text={group.group_name}
        font={font}
      />
    </Group>
  );
}
