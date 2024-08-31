import { Canvas, Group } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  useDerivedValue,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

import {
  INITIAL_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_SENSITIVITY,
} from "@/lib/hooks/useGestures";
import type { Node } from "@/lib/utils/newTreeGraphStrategy";

import TreeNode from "./TreeNode";

interface Props {
  descendants: d3.HierarchyPointNode<Node>[];
  links: d3.HierarchyPointLink<Node>[];
}

export default function Tree({ descendants, links }: Props) {
  const { height, width } = useWindowDimensions();
  const cx = width / 2;
  const cy = height / 2;

  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const initialFocalX = useSharedValue(0);
  const initialFocalY = useSharedValue(0);

  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .onStart((e) => {
          initialFocalX.value = e.focalX;
          initialFocalY.value = e.focalY;
        })
        .onChange((e) => {
          const scaleFactor = 1 + (e.scale - 1) * SCALE_SENSITIVITY;
          const newScale = Math.min(
            Math.max(lastScale.value * scaleFactor, MIN_SCALE),
            MAX_SCALE,
          );

          // only apply translation if the scale is actually changing
          if (newScale !== scale.value) {
            // Calculate the change in scale
            const scaleChange = newScale / scale.value;

            // Update the scale
            scale.value = newScale;

            // Adjust the translation to keep the center point fixed
            translateX.value = translateX.value * scaleChange;
            translateY.value = translateY.value * scaleChange;
            // console.log(scale.value);
          }
        })
        .onEnd((e) => {
          lastScale.value = scale.value;
        }),
    [initialFocalX, initialFocalY, lastScale, scale, translateX, translateY],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          translateX.value += e.changeX;
          translateY.value += e.changeY;
        })
        .onEnd((e) => {
          translateX.value = withDecay({
            velocity: e.velocityX,
            deceleration: 0.995,
          });
          translateY.value = withDecay({
            velocity: e.velocityY,
            deceleration: 0.995,
          });
        }),
    [translateX, translateY],
  );

  const transform = useDerivedValue(() => {
    return [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ];
  });

  const composed = useMemo(
    () => Gesture.Simultaneous(pan, pinch),
    [pan, pinch],
  );

  return (
    <GestureDetector gesture={composed}>
      <Canvas
        style={{
          flex: 1,
          backgroundColor: "green",
        }}
      >
        <Group origin={{ x: cx, y: cy }} transform={transform}>
          {descendants.map((node) => (
            <TreeNode key={node.data.name} node={node} />
          ))}
        </Group>
      </Canvas>
    </GestureDetector>
  );
}
