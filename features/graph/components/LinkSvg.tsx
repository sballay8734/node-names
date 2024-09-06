import { Group, Path, Skia } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

interface LinkSvgProps {
  id: number;
}

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = (height - TAB_BAR_HEIGHT) / 2;

export default function LinkSvg({ id }: LinkSvgProps) {
  const link = useAppSelector(
    (state: RootState) => state.graphData.links.byId[id],
  );

  if (!link) return null;

  const path = Skia.Path.Make();
  path.moveTo(link.x1, link.y1);
  path.lineTo(link.x2, link.y2);
  path.close();

  return (
    <Group origin={{ x: centerX, y: centerY }}>
      <Path
        path={path}
        color="#96a9b0"
        strokeWidth={2}
        strokeJoin={"round"}
        strokeCap={"round"}
        style={"stroke"}
      />
    </Group>
  );
}
