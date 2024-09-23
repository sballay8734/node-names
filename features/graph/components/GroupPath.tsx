import {
  Group,
  matchFont,
  Paint,
  Path,
  Skia,
  Text,
} from "@shopify/react-native-skia";

import { getColors } from "@/lib/utils/getColors";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface Props {
  id: number;
}

const RADIUS = 1800;

const font = matchFont({
  fontFamily: "Helvetica",
  fontSize: 50,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function GroupPath({ id }: Props) {
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const radius = RADIUS;
  const group = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[id],
  );

  if (group.startAngle === undefined || group.endAngle === undefined)
    return null;

  const centerX = windowSize.width / 2;
  const centerY = windowSize.height / 2;

  const startAngle = group.startAngle;
  const endAngle = group.endAngle;
  const startDeg = startAngle * (180 / Math.PI);
  const endDeg = endAngle * (180 / Math.PI);

  const path = Skia.Path.Make();

  // Move to the center of the circle
  path.moveTo(centerX, centerY);
  // path.lineTo(startX, startY);
  path.arcToOval(
    {
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2,
    },
    startDeg,
    endDeg - startDeg,
    false,
  );
  path.close();

  const color = getColors(group);

  // Calculate midpoint angle for label
  const midAngle = (startAngle + endAngle) / 2;

  // Measure text
  const textMeasurements =
    group.group_name && font.measureText(group.group_name);

  const textWidth = textMeasurements && textMeasurements.width;
  const textHeight = textMeasurements && textMeasurements.height;

  // Calculate position of label
  const labelRadius = radius * 0.2;
  const rawLabelX = centerX + labelRadius * Math.cos(midAngle);
  const rawLabelY = centerY + labelRadius * Math.sin(midAngle);

  // Adjust label position based on text size
  const adjustedLabelX = textWidth && rawLabelX - textWidth / 2;
  const adjustedLabelY = textHeight && rawLabelY - textHeight / 4;

  return (
    <Group origin={{ x: centerX, y: centerY }}>
      <Path path={path} color={color.active} opacity={0.05}>
        <Paint
          style={"stroke"}
          // color={color.active}
          color="black"
          strokeWidth={2}
          opacity={0.3}
        />
      </Path>
      <Text
        opacity={0.2}
        x={adjustedLabelX ? adjustedLabelX : 0}
        y={adjustedLabelY ? adjustedLabelY : 0}
        text={group.name}
        font={font}
        color={color.active}
        // opacity={animatedTextOpacity}
      />
    </Group>
  );
}
