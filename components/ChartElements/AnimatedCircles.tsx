import { Data } from "./Circles";
import { Canvas, Circle } from "@shopify/react-native-skia";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export default function AnimatedCircles({ dataset }: Data) {
  return (
    <Canvas
      style={{
        flex: 1,
        backgroundColor: "#2b4543",
        height: "50%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dataset.map(([x, y], index) => (
        <>
          <Circle
            key={index}
            cx={x * 3}
            cy={y * 3}
            r={6}
            color={"#52aba3"}
            strokeWidth={2.5}
            opacity={1}
          />
          {/* REVIEW: vvv I think you need this vvv */}
          {/* <GestureDetector gesture={gesture}>
            <Animated.View style={style} />
          </GestureDetector> */}
        </>
      ))}
    </Canvas>
  );
}

// !TODO: You might need "Element Tracking" from here: https://shopify.github.io/react-native-skia/docs/animations/gestures
