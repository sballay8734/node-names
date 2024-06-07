import { Canvas, Circle } from "@shopify/react-native-skia";

interface CircleProps {
  cx: string;
  cy: string;
  radius: string; // could be determined by # of connections
  stroke: string; // could be determined by group or by user
  strokeWidth: string; // determined globally and on active
  fill: string; // could be determined by group or by user
}

export interface Data {
  dataset: number[][];
}

export default function Circles({ dataset }: Data) {
  return (
    <Canvas
      style={{
        flex: 1,
        backgroundColor: "#452b2b",
        height: "50%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dataset.map(([x, y], i) => (
        <Circle
          key={i}
          cx={x * 3}
          cy={y * 3}
          r={6}
          color="#a84c4c" // fill color of circle
          strokeWidth={2.5}
          opacity={1}
        />
      ))}
    </Canvas>
  );
}

// see https://docs.expo.dev/versions/latest/sdk/svg/ for more info on SVG use

/*
VIEWBOX PROPERTIES (min-x, min-y, width, height)
min-x: The top left x coordinate of the viewBox
min-y: The top left y coordinate of the viewBox
width: The width of the viewBox in user coordinates or pixels
height: The height of the viewBox in user coordinates or pixels

*/
