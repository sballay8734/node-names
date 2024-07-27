import { Canvas, Group, Line, Paint } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { StyleSheet } from "react-native";

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

  const svgTransform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  const origin = useDerivedValue(() => ({
    x: windowSize.width / 2,
    y: windowSize.height / 2,
  }));

  return (
    <Canvas style={styles.canvas}>
      <Group origin={origin} transform={svgTransform}>
        {finalizedLinks &&
          finalizedLinks.map((link) => {
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
                  color="transparent"
                  style="stroke"
                  strokeWidth={1}
                >
                  <Paint
                    // color="#1c1c24"
                    color="#e8e2ae"
                    strokeWidth={1}
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

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    // backgroundColor: "rgba(155, 155, 0, 0.3)",
  },
});
