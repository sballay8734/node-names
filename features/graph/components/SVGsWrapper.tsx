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
import { useAppDispatch } from "@/store/reduxHooks";

import { setTestInitialState } from "../redux/graphSlice";

import NewGroup from "./Group";
import NewPerson from "./NewPerson";

interface SVGsWrapperProps {
  windowSize: WindowSize;
}

const data = {
  groups,
  people,
  links,
};

export default function SVGsWrapper({ windowSize }: SVGsWrapperProps) {
  const dispatch = useAppDispatch();
  const {
    data: { groups, people, links },
  } = createGraph(data, windowSize, dispatch, setTestInitialState);
  const scale = useSharedValue(INITIAL_SCALE);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);
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
          {people.map((person) => {
            return <NewPerson key={person.id} person={person} />;
          })}
        </Group>
      </Canvas>
    </GestureDetector>
  );
}

const byId = {
  "1": {
    depth: 1,
    group_id: null,
    id: 1,
    isCurrentRoot: true,
    isShown: true,
    name: "Root",
    node_status: "active",
    x: 196.5,
    y: 386.5,
  },
  "2": {
    depth: 2,
    group_id: 1,
    id: 2,
    isCurrentRoot: false,
    isShown: true,
    name: "Aaron",
    node_status: "inactive",
    x: 196.5,
    y: 179.29999999999998,
  },
  "3": {
    depth: 2,
    group_id: 2,
    id: 3,
    isCurrentRoot: false,
    isShown: true,
    name: "Beth",
    node_status: "inactive",
    x: 393.5589101763558,
    y: 322.4716787655109,
  },
  "4": {
    depth: 3,
    group_id: 3,
    id: 4,
    isCurrentRoot: false,
    isShown: true,
    name: "Carol",
    node_status: "inactive",
    x: 318.28910427500045,
    y: 554.128321234489,
  },
  "5": {
    depth: 3,
    group_id: 4,
    id: 5,
    isCurrentRoot: false,
    isShown: true,
    name: "Diana",
    node_status: "inactive",
    x: 74.71089572499959,
    y: 554.1283212344891,
  },
  "6": {
    depth: 3,
    group_id: 5,
    id: 6,
    isCurrentRoot: false,
    isShown: true,
    name: "Ethan",
    node_status: "inactive",
    x: -0.5589101763558517,
    y: 322.47167876551094,
  },
};
