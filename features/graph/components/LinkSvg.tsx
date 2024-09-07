import {
  Group,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface LinkSvgProps {
  id: number;
}

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = (height - TAB_BAR_HEIGHT) / 2;

const colorMap: { [key: string]: string } = {
  active: "rgba(255, 255, 255, 1)",
  parent_active: "rgba(255, 255, 255, 0.5)",
  inactive: "rgba(255, 255, 255, 0)",
};

export default function LinkSvg({ id }: LinkSvgProps) {
  const link = useAppSelector(
    (state: RootState) => state.graphData.links.byId[id],
  );
  const sourceStatus = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.byId[link.source_id].node_status,
  );

  console.log(sourceStatus);

  const color = colorMap[sourceStatus];

  const progress = useSharedValue(sourceStatus !== "inactive" ? 1 : 0);
  const opacity = useSharedValue(sourceStatus !== "inactive" ? 1 : 0);

  useEffect(() => {
    const isActive = sourceStatus !== "inactive";
    const duration = 500;

    progress.value = withTiming(isActive ? 1 : 0, {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    opacity.value = withTiming(isActive ? 1 : 0, {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [sourceStatus, opacity, progress]);

  const startPath = Skia.Path.Make();
  startPath.moveTo(link.x1, link.y1);
  startPath.lineTo(link.x1, link.y1);

  const endPath = Skia.Path.Make();
  endPath.moveTo(link.x1, link.y1);
  endPath.lineTo(link.x2, link.y2);

  const animatedPath = usePathInterpolation(
    progress,
    [0, 1],
    [startPath, endPath],
  );

  const animatedOpacity = useDerivedValue(() => opacity.value);

  if (!link) return null;

  return (
    <Group opacity={animatedOpacity} origin={{ x: centerX, y: centerY }}>
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
