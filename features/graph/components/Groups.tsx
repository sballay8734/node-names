import { Canvas, Fill, Group } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  useDerivedValue,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

import { people, links, groups } from "@/lib/data/new_structure";
import {
  INITIAL_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_SENSITIVITY,
} from "@/lib/hooks/useGestures";
import { WindowSize } from "@/lib/types/misc";
import { createGraph } from "@/lib/utils/newNew";

import NewGroup from "./Group";

interface GroupsProps {
  windowSize: WindowSize;
}

const data = {
  groups,
  people,
  links,
};

export default function Groups({ windowSize }: GroupsProps) {
  const {
    data: { groups },
  } = createGraph(data, windowSize);
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);
  const initialFocalX = useSharedValue(0);
  const initialFocalY = useSharedValue(0);

  console.log(groups);

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
            const adjustedFocalX = initialFocalX.value - translateX.value;
            const adjustedFocalY = initialFocalY.value - translateY.value;

            translateX.value -= adjustedFocalX * (scaleChange - 1);
            translateY.value -= adjustedFocalY * (scaleChange - 1);
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
        }}
      >
        <Fill color="#092730" />
        <Group transform={transform}>
          {groups.map((group) => {
            return <NewGroup key={group.id} group={group} />;
          })}
        </Group>
      </Canvas>
    </GestureDetector>
  );
}

const testGroups = [
  { group_name: "friends", id: 1, x: 373.35, y: 386.5 },
  { group_name: "work", id: 2, x: 251.14965545520946, y: 554.6943449067979 },
  { group_name: "family", id: 3, x: 53.42534454479056, y: 490.4498218679239 },
  { group_name: "school", id: 4, x: 53.42534454479056, y: 282.55017813207616 },
  { group_name: "online", id: 5, x: 251.14965545520943, y: 218.3056550932021 },
];
