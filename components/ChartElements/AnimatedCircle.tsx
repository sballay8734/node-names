// REVIEW: Investigating...

// import { useEffect, useRef } from "react";
// import { animated, useSpring } from "@react-spring/native";
// import { Circle } from "@shopify/react-native-skia";

// interface Props {
//   index: number;
//   isShowing: boolean;
// }

// export default function AnimatedCircle({ index, isShowing }: Props) {
//   const wasShowing = useRef(false);

//   useEffect(() => {
//     wasShowing.current = isShowing;
//   }, [isShowing]);

//   const viewStyle = useSpring({
//     config: {
//       duration: 1200,
//     },
//     r: isShowing ? 6 : 0,
//     opacity: isShowing ? 1 : 0,
//   });

//   return (
//     <animated.View>
//       <Circle
//         key={index}
//         cx={index * 3}
//         cy={10}
//         r={6}
//         color={"red"}
//         strokeWidth={2.5}
//         opacity={1}
//       />
//     </animated.View>
//   );
// }
