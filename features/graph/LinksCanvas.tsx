import { Canvas, Group, Line, Paint } from "@shopify/react-native-skia";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { useAppSelector } from "@/hooks/reduxHooks";
import { WindowSize } from "@/hooks/useWindowSize";
import { RootState } from "@/store/store";
import { FinalizedLink } from "@/utils/positionGraphElements";

interface Props {
  windowSize: WindowSize;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  scale: SharedValue<number>;
}

export default function LinksCanvas({
  windowSize,
  translateX,
  translateY,
  scale,
}: Props): React.JSX.Element {
  const finalizedLinks = useAppSelector(
    (state: RootState) => state.selections.links,
  );

  const origin = useSharedValue({
    x: windowSize.windowCenterX,
    y: windowSize.windowCenterY,
  });

  const svgTransform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  return (
    <Canvas style={{ flex: 1, backgroundColor: "transparent" }}>
      <Group
        origin={{
          x: origin.value.x,
          y: origin.value.y,
        }}
        transform={svgTransform}
      >
        {finalizedLinks &&
          finalizedLinks.map((link) => {
            // console.log(link);
            {
              return (
                <Line
                  key={`${link.person_1_id}-${link.person_2_id}`}
                  p1={{
                    x: (link as FinalizedLink).source.x,
                    y: (link as FinalizedLink).source.y,
                  }}
                  p2={{
                    x: (link as FinalizedLink).target.x,
                    y: (link as FinalizedLink).target.y,
                  }}
                  color="transparent" // Adjust color as needed
                  style="stroke"
                  strokeWidth={1} // Adjust thickness as needed
                >
                  <Paint
                    // color="#1c1c24"
                    color="#e8e2ae"
                    strokeWidth={2}
                    style="stroke"
                    strokeCap="round"
                  />
                </Line>
              );
            }
          })}
      </Group>
    </Canvas>
  );
}
