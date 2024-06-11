import {
  Canvas,
  Circle,
  Path,
  Skia,
  matchFont,
  useFonts,
} from "@shopify/react-native-skia";
import * as d3 from "d3";
import { Dimensions, View, Text } from "react-native";
// import { Data } from "./Circles";
import { NodePerson, NodeLink } from "@/types/graphTypes";

interface GraphData {
  dataset: {
    nodes: NodePerson[];
    links: NodeLink[];
  };
}

export default function TestForceGraph({ dataset }: GraphData) {
  // const customFontMgr = useFonts({
  //   SpaceMono: [require("../../assets/fonts/SpaceMono-Regular.ttf")],
  // });

  // if (!customFontMgr) {
  //   return null;
  // }

  // const fontStyle = {
  //   fontFamily: "SpaceMono",
  //   fontWeight: "bold",
  //   fontSize: 16,
  // } as const;

  // const font = matchFont(fontStyle, customFontMgr);

  // get height and width to position nodes
  const windowWidth = Dimensions.get("window").width;

  // !TODO: This value vvv is hardcoded (for iPhone 14 pro) and shouldn't be. It should somehow get the size of the canvas and possibly use insets to calculate vvvvvvvvvvvvvv
  const windowHeight = 675;

  // Determine the center of the canvas
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;

  const nodes = dataset.nodes.map((node, index) => ({
    ...node,
    x: node.rootNode ? centerX : Math.random() * windowWidth, // Place rootNode at the center
    y: node.rootNode ? centerY : Math.random() * windowHeight,
    // more connections = bigger icon
    connections: dataset.links.filter((link) => link.source === node.id).length,
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
              key={`link-${index + link.source}`}
              path={skPath!}
              style="stroke"
              strokeWidth={1}
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
          r={node.connections === 0 ? 5 : 5 * node.connections}
          color="#fff"
          strokeWidth={1.5}
        />
        // <Text x={node.x} y={node.y} text={node.firstName} />
      ))}
    </Canvas>
  );
}

// !TODO: Need to add ability to scroll around
