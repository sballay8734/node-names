import { Platform, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Canvas, Path, Skia, matchFont } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";
import { NodePerson, NodeLink } from "@/types/graphTypes";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

interface GraphData {
  dataset: {
    nodes: NodePerson[];
    links: NodeLink[];
  };
}

interface ProcessedNode extends NodePerson {
  x: number;
  y: number;
  connections: number;
}

// mTODO: These should not be hard coded like this
const IOS_TOP_BAR_HEIGHT = 98;
const BOTTOM_TAB_BAR_HEIGHT = 79;

// mTODO: Had many problems trying to use fonts already loaded by expo.
// REVIEW: This is a workaround that allows you to move forward vvvvvvvvvvvvvvv
const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });

const fontStyle = {
  fontFamily,
  fontSize: 10,
  fontWeight: "500",
} as const;

const font = matchFont(fontStyle);
// REVIEW: WORKAROUND ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export default function TestForceGraph({ dataset }: GraphData) {
  // get height and width to position nodes
  const windowWidth = Dimensions.get("window").width;
  const windowHeight =
    Dimensions.get("window").height -
    (IOS_TOP_BAR_HEIGHT + BOTTOM_TAB_BAR_HEIGHT);

  const MARGIN = 15;
  // Determine the center of the canvas
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;

  const nodes: ProcessedNode[] = dataset.nodes.map((node, index) => ({
    ...node,
    x: node.rootNode
      ? centerX
      : Math.random() * (windowWidth - 2 * MARGIN) + MARGIN, // Place rootNode at the center
    y: node.rootNode
      ? centerY
      : Math.random() * (windowHeight - 2 * MARGIN) + MARGIN,
    // more connections = bigger icon
    connections: dataset.links.filter((link) => link.source === node.id).length,
  }));

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  // Pinch Gesture
  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(windowWidth / 100, windowHeight / 100),
      );
    })
    .runOnJS(true);

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={pinch}>
      <Animated.View style={[styles.box, boxAnimatedStyles]}>
        <Canvas
          style={{
            flex: 1, // Since there are no siblings this is h-100%
            // backgroundColor: "#452b2b",
            width: "100%",
            height: "100%",
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
          {/* {nodes.map((node, index) => {
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
                  x={node.x - font.measureText(node.firstName).width / 2}
                  // mTODO: vv This is NOT exact center close enough for now
                  y={node.y + font.getSize() / 4}
                  text={node.firstName}
                  font={font}
                  strokeWidth={2}
                  style={"fill"}
                />
              </Group>
            );
          })} */}
        </Canvas>
      </Animated.View>
    </GestureDetector>
  );
}

// !TODO: Need to add ability to scroll around
// !TODO: Font size should scale based on circle size
// !TODO: Names shouldn't show at all if the circles are too small
// !TODO: Keep in mind that GestureDetector is not compatible with the Animated API, nor with Reanimated 1. FROM DOCS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#452b2b",
  },
  box: {
    width: "100%",
    height: "100%",
    backgroundColor: "#452b2b",
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    position: "absolute",
    left: "50%",
    top: "50%",
    pointerEvents: "none",
  },
});
