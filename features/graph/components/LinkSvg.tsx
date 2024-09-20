import {
  BlurMask,
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

import { LINK_COLORS, LINK_OPACITY } from "@/lib/constants/Colors";
import {
  GROUP_NODE_RADIUS,
  REG_NODE_RADIUS,
  ROOT_NODE_RADIUS,
} from "@/lib/constants/styles";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface LinkSvgProps {
  id: number;
}

const TEST_USER_ID = 1;

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
      progress.value = withTiming(1, { duration: 200 });
      return;
    }
    progress.value = withTiming(0, { duration: 200 });
  }, [sourceStatus, progress]);

  function calculateIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    return {
      x: x1 + unitX * radius,
      y: y1 + unitY * radius,
    };
  }

  const sourceRadius =
    link.source_type === "root"
      ? ROOT_NODE_RADIUS
      : link.source_type === "group"
      ? GROUP_NODE_RADIUS
      : REG_NODE_RADIUS;

  const targetRadius =
    link.target_type === "root"
      ? ROOT_NODE_RADIUS
      : link.target_type === "group"
      ? GROUP_NODE_RADIUS
      : REG_NODE_RADIUS;

  const startPoint = calculateIntersection(
    link.x1,
    link.y1,
    link.x2,
    link.y2,
    sourceRadius,
  );
  const endPoint = calculateIntersection(
    link.x2,
    link.y2,
    link.x1,
    link.y1,
    targetRadius,
  );

  const startPath = Skia.Path.Make();
  startPath.moveTo(startPoint.x, startPoint.y);
  startPath.lineTo(startPoint.x, startPoint.y);

  const endPath = Skia.Path.Make();
  endPath.moveTo(startPoint.x, startPoint.y);
  endPath.lineTo(endPoint.x, endPoint.y);

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
        strokeWidth={0.5}
        strokeJoin="round"
        strokeCap="round"
        style="stroke"
      />
      <BlurMask style={"solid"} blur={2} />
    </Group>
  );
}
