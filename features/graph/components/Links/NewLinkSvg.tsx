import {
  BlurMask,
  Group,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";
import { groupMap } from "@/lib/utils/getColors";

interface LinkSvgProps {
  link_id: number;
}

export default function NewLinkSvg({ link_id }: LinkSvgProps) {
  const { windowCenterX: centerX, windowCenterY: centerY } = useAppSelector(
    (state: RootState) => state.windowSize,
  );
  const link = useAppSelector(
    (state: RootState) => state.graphData.links.byId[link_id],
  );
  const rootNodeId = useAppSelector(
    (state: RootState) => state.graphData.nodes.activeRootId,
  );
  const sourceStatus = useAppSelector(
    (state: RootState) =>
      link.source_type === "root_group" &&
      rootNodeId &&
      state.graphData.nodes.byId[rootNodeId].node_status,
  );
  const targetGroup = useAppSelector(
    (state: RootState) => state.graphData.nodes.byId[link.target_id].group_name,
  );
  const color = targetGroup ? groupMap[targetGroup].inactive : "red";

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(sourceStatus ? 1 : 0, { duration: 300 });
  }, [progress, sourceStatus]);

  const start = Skia.Path.Make();
  start.moveTo(link.x1, link.y1);
  start.lineTo(link.x1, link.y1); // Start as a point

  const end = Skia.Path.Make();
  end.moveTo(link.x1, link.y1);
  end.lineTo(link.x2, link.y2); // End as the full line

  const animatedPath = usePathInterpolation(progress, [0, 1], [start, end]);

  return (
    <Group origin={{ x: centerX, y: centerY }}>
      <Path
        // opacity={animateOpacity}
        path={animatedPath}
        color={color}
        strokeWidth={0.5}
        strokeJoin="round"
        strokeCap="round"
        style="stroke"
      />
      {/* <BlurMask style={"solid"} blur={2} /> */}
    </Group>
  );
}
