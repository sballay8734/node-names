// import { useMemo } from "react";
// import { Gesture } from "react-native-gesture-handler";
// import { useSharedValue, withDecay } from "react-native-reanimated";

// export const MIN_SCALE = 0.3;
// export const MAX_SCALE = 4;

// export const INITIAL_SCALE = 1;
// export const CENTER_ON_SCALE = 0.4;
// export const SCALE_SENSITIVITY = 1.2;

// export const useGestures = () => {
//   // console.log(`[${new Date().toISOString()}] Running useGestures`);
//   const scale = useSharedValue(INITIAL_SCALE);
//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const lastScale = useSharedValue(INITIAL_SCALE);
//   const initialFocalX = useSharedValue(0);
//   const initialFocalY = useSharedValue(0);

//   // Shared values to track how much the center shifts
//   const centerShiftX = useSharedValue(0);
//   const centerShiftY = useSharedValue(0);

//   const pinch = useMemo(
//     () =>
//       Gesture.Pinch()
//         .onStart((e) => {
//           initialFocalX.value = e.focalX;
//           initialFocalY.value = e.focalY;
//         })
//         .onChange((e) => {
//           const scaleFactor = 1 + (e.scale - 1) * SCALE_SENSITIVITY;
//           const newScale = Math.min(
//             Math.max(lastScale.value * scaleFactor, MIN_SCALE),
//             MAX_SCALE,
//           );

//           // only apply translation if the scale is actually changing
//           if (newScale !== scale.value) {
//             // Calculate the change in scale
//             const scaleChange = newScale / scale.value;

//             // Update the scale
//             scale.value = newScale;

//             // Adjust the translation to keep the center point fixed
//             const adjustedFocalX = initialFocalX.value - translateX.value;
//             const adjustedFocalY = initialFocalY.value - translateY.value;

//             translateX.value -= adjustedFocalX * (scaleChange - 1);
//             translateY.value -= adjustedFocalY * (scaleChange - 1);

//             centerShiftX.value += adjustedFocalX * (scaleChange - 1);
//             centerShiftY.value += adjustedFocalY * (scaleChange - 1);
//           }

//           // console.log(scale.value);
//         })
//         .onEnd((e) => {
//           lastScale.value = scale.value;
//         }),
//     [
//       initialFocalX,
//       initialFocalY,
//       lastScale,
//       scale,
//       translateX,
//       translateY,
//       centerShiftX,
//       centerShiftY,
//     ],
//   );

//   const pan = useMemo(
//     () =>
//       Gesture.Pan()
//         .onChange((e) => {
//           translateX.value += e.changeX;
//           translateY.value += e.changeY;

//           // centerShiftX.value += e.changeX;
//           // centerShiftY.value += e.changeY;
//         })
//         .onEnd((e) => {
//           translateX.value = withDecay({
//             velocity: e.velocityX,
//             deceleration: 0.995,
//           });
//           translateY.value = withDecay({
//             velocity: e.velocityY,
//             deceleration: 0.995,
//           });
//         }),
//     [translateX, translateY],
//   );

//   const composed = useMemo(
//     () => Gesture.Simultaneous(pan, pinch),
//     [pan, pinch],
//   );

//   return {
//     composed,
//     scale,
//     translateX,
//     translateY,
//     lastScale,
//     initialFocalX,
//     initialFocalY,
//     centerShiftX,
//     centerShiftY,
//   };
// };