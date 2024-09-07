import {
  Group,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface LinkSvgProps {
  id: number;
}

const colorMap: { [key: string]: string } = {
  active: "rgba(255, 255, 255, 1)",
  parent_active: "rgba(255, 255, 255, 0.5)",
  inactive: "rgba(255, 255, 255, 0.3)",
};

export default function LinkSvg({ id }: LinkSvgProps) {
  const {
    width,
    height,
    windowCenterX: centerX,
    windowCenterY: centerY,
  } = useAppSelector((state: RootState) => state.windowSize);

  const link = useAppSelector(
    (state: RootState) => state.graphData.links.byId[id],
  );
  const sourceStatus = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.byId[link.source_id].node_status,
  );

  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const color = useDerivedValue(() => {
    return withTiming(
      sourceStatus === "active" ? colorMap.active : colorMap.inactive,
      { duration: 200 },
    );
  });

  useEffect(() => {
    if (sourceStatus === "active") {
      progress.value = withTiming(1, { duration: 200 });
      opacity.value = 1;
      return;
    }
    progress.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 100 });
  }, [sourceStatus, progress, opacity]);

  const startPath = Skia.Path.Make();
  startPath.moveTo(link.x1, link.y1);
  startPath.lineTo(link.x1, link.y1);

  const endPath = Skia.Path.Make();
  endPath.moveTo(link.x1, link.y1);
  endPath.lineTo(link.x2, link.y2);

  // Adjust interpolation range based on current status
  const animatedPath = usePathInterpolation(
    progress,
    [0, 1], // This still goes between 0 and 1
    [startPath, endPath],
  );

  const animateOpacity = useDerivedValue(() => {
    return withTiming(opacity.value, { duration: 300 });
  });

  if (!link) return null;

  return (
    <Group opacity={animateOpacity} origin={{ x: centerX, y: centerY }}>
      <Path
        path={animatedPath}
        color={color}
        strokeWidth={2}
        strokeJoin="round"
        strokeCap="round"
        style="stroke"
      />
    </Group>
  );
}
