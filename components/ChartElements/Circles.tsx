import Svg, { Circle } from "react-native-svg";

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
    <Svg
      height="50%"
      width="100%"
      viewBox="0 0 100 100"
      style={{ backgroundColor: "#2e2323" }}
    >
      {dataset.map(([x, y], i) => (
        <Circle
          key={i}
          cx={x}
          cy={y}
          r="4"
          stroke=""
          strokeWidth="2.5"
          fill="#a84c4c"
        />
      ))}
    </Svg>
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
