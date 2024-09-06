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
import { PositionedPerson } from "@/lib/utils/positionGraphEls";

interface NodeSvgProps {
  person: PositionedPerson;
}

// REMOVE:
export const HARD_CODE_RADIUS = 20;
const HARD_CODE_SW = 2;
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

export default function NodeSvg({ person }: NodeSvgProps) {
  const radius = person.depth === 1 ? 35 : HARD_CODE_RADIUS;
  const color = person.depth === 1 ? "#fccfff" : "#400601";

  const trans = useSharedValue({
    rotate: 0,
    x: centerX,
    y: centerY,
  });

  useEffect(() => {
    trans.value = withTiming(
      { rotate: 0, x: person.x, y: person.y },
      { duration: 500, easing: Easing.inOut(Easing.cubic) },
    );
  }, [person.x, person.y, trans]);

  const transform = useDerivedValue(() => {
    return [
      { rotate: trans.value.rotate },
      { translateX: trans.value.x },
      { translateY: trans.value.y },
    ];
  });

  return (
    <Group origin={{ x: centerX, y: centerY }} transform={transform}>
      <Circle r={radius}>
        <Paint color={color} />
        <Paint color="#486c78" style="stroke" strokeWidth={HARD_CODE_SW} />
        <Paint color="#527a87" style="stroke" strokeWidth={HARD_CODE_SW / 2} />
      </Circle>
      <Text
        x={HARD_CODE_SHIFT_X}
        y={HARD_CODE_SHIFT_Y}
        text={person.name}
        font={font}
      />
    </Group>
  );
}
