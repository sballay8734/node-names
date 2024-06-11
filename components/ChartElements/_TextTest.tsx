import { Platform } from "react-native";
import { Canvas, Text, matchFont, Fill } from "@shopify/react-native-skia";

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });

const fontStyle = {
  fontFamily,
  fontSize: 14,
  fontWeight: "500",
} as const;

const font = matchFont(fontStyle);

export default function TextTest() {
  return (
    <Canvas style={{ flex: 1, width: "100%" }}>
      <Fill color="white" />
      <Text x={0} y={fontStyle.fontSize} text="Hello World" font={font} />
    </Canvas>
  );
}
