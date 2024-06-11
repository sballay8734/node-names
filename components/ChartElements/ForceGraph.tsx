import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import * as d3 from "d3";
import { Dimensions } from "react-native";
// import { Data } from "./Circles";

interface Node {
  id: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

export interface Data {
  dataset: {
    nodes: Node[];
    links: Link[];
  };
}

export default function ForceGraph({ dataset }: Data) {
  // get height and width to position nodes
  const windowWidth = Dimensions.get("window").width;
  // !TODO: This value vvv is hardcoded (for iPhone 14 pro) and shouldn't be. It should somehow get the size of the canvas and possibly use insets to calculate vvvvvvvvvvvvvv
  const windowHeight = 675;

  const nodes = dataset.nodes.map((node, index) => ({
    ...node,
    x: Math.random() * windowWidth,
    y: Math.random() * windowHeight,
  }));

  return (
    <Canvas
      style={{
        flex: 1, // Since there are no siblings this is h-100%
        backgroundColor: "#452b2b",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dataset.links.map((link, index) => {
        const source = nodes.find((node) => node.id === link.source);
        const target = nodes.find((node) => node.id === link.target);

        if (source && target) {
          const nodeLink = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
          const skPath = Skia.Path.MakeFromSVGString(nodeLink);

          return (
            <Path
              key={`link-${index}`}
              path={skPath!}
              style="stroke"
              strokeWidth={Math.sqrt(link.value) / 3}
              color="#000000"
              opacity={0.6}
            />
          );
        }

        return null;
      })}
      {nodes.map((node, index) => (
        <Circle
          key={`node-${index}`}
          cx={node.x}
          cy={node.y}
          r={5}
          color="#fff"
          strokeWidth={1.5}
        />
      ))}
    </Canvas>
  );
}
