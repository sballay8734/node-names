import { Canvas, Group, Line, Paint } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

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
    (state: RootState) => state.selections.userLinks,
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

  // REMOVE: "options" and function are just for testing
  const options = [true, false];
  function sourceIsSelected() {
    return options[Math.floor(Math.random() * options.length)];
  }

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
                    color={
                      sourceIsSelected()
                        ? "rgba(245, 240, 196, 1)"
                        : "rgba(245, 240, 196, 0.05)"
                    }
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
