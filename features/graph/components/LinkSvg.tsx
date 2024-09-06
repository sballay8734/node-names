import {
  Group,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

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
  active: "#ffffff",
  parent_active: "#ffffff",
  inactive: "#4d4d4d",
};

export default function LinkSvg({ id }: LinkSvgProps) {
  const link = useAppSelector(
    (state: RootState) => state.graphData.links.byId[id],
  );
  const sourceStatus = useAppSelector(
    (state: RootState) =>
      state.graphData.nodes.byId[link.source_id].node_status,
  );

  if (link.relation_type === "group") {
    console.log(link);
  }

  const color = colorMap[sourceStatus];

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 500 });
  }, [progress]);

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

  if (!link) return null;

  return (
    <Group origin={{ x: centerX, y: centerY }}>
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
