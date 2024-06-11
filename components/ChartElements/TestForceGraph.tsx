import { Platform } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  Text,
  matchFont,
} from "@shopify/react-native-skia";
import * as d3 from "d3";
import { Dimensions } from "react-native";
// import { Data } from "./Circles";
import { NodePerson, NodeLink } from "@/types/graphTypes";

interface GraphData {
  dataset: {
    nodes: NodePerson[];
    links: NodeLink[];
  };
}

// !TODO: Had many problems trying to use fonts already loaded by expo.
// REVIEW: This is a workaround that allows you to move forward vvvvvvvvvvvvvvv
const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });

const fontStyle = {
  fontFamily,
  fontSize: 10,
  fontWeight: "500",
} as const;

const font = matchFont(fontStyle);
// REVIEW: WORKAROUND ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

export default function TestForceGraph({ dataset }: GraphData) {
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
      {nodes.map((node, index) => {
        if (index === 0) {
          console.log("NODES:", node.x, node.y);
          console.log("FONT SIZE:", font.getSize());
          console.log(
            "TEXT X:",
            node.x - font.measureText(node.firstName).width / 2,
          );
          console.log("TEXT Y:", node.y + font.getSize() / 4);
        }
        return (
          <Group key={`node-${index}`}>
            <Circle
              cx={node.x}
              cy={node.y}
              r={node.connections === 0 ? 7 : 7 * node.connections}
              color="#171717"
              strokeWidth={1.5}
            />
            <Text
              color={"#ffffff"}
              x={node.x - font.measureText(node.firstName).width / 2} // Center the text horizontally
              // mTODO: vv This is NOT the exact center but close enough for now
              y={node.y + font.getSize() / 4}
              text={node.firstName}
              font={font}
              strokeWidth={2}
              style={"fill"}
            />
          </Group>
        );
      })}
    </Canvas>
  );
}

// !TODO: Need to add ability to scroll around
// !TODO: Font size should scale based on circle size
// !TODO: Names shouldn't show at all if the circles are too small
