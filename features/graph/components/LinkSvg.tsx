import {
  Group,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  LINK_COLORS,
  LINK_OPACITY,
  TEXT_OPACITY,
} from "@/lib/constants/Colors";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface LinkSvgProps {
  id: number;
}

export default function LinkSvg({ id }: LinkSvgProps) {
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );

  const link = useAppSelector(
    (state: RootState) => state.graphData.links.byId[id],
  );
  const sourceStatus = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.byId[link.source_id].node_status,
  );
  const targetStatus = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.byId[link.target_id].node_status,
  );
  const targetGroup = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[link.target_id].group_name,
  );

  const color = targetGroup
    ? LINK_COLORS[targetGroup]
    : LINK_COLORS["Fallback"];
  const progress = useSharedValue(0);

  useEffect(() => {
    if (sourceStatus === "active") {
      progress.value = withTiming(1, { duration: 300 });
      return;
    }
    progress.value = withTiming(0, { duration: 300 });
  }, [sourceStatus, progress]);

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
    const newOpacity =
      sourceStatus === "active" && targetStatus === "active"
        ? 1
        : LINK_OPACITY[sourceStatus];

    return withTiming(newOpacity, {
      duration: 200,
      easing: Easing.cubic,
    });
  });

  if (!link) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }}>
      <Path
        opacity={animateOpacity}
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
