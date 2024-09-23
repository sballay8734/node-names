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
  fontSize: 10,
  fontStyle: "normal",
  fontWeight: "400",
});

export default function GroupPath({ id }: Props) {
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  // const radius = Math.min(windowSize.width / 2, windowSize.height / 2);
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
        x={centerX + 50}
        y={centerY + group.endAngle * 10}
        text={group.name}
        font={font}
        color={"white"}
        // opacity={animatedTextOpacity}
      />
    </Group>
  );
}
