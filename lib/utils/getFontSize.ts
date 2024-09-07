import { SkFont } from "@shopify/react-native-skia";

export function getFontSize(
  text: string,
  font: SkFont,
): { xOffset: number; yOffset: number } {
  const fontSize = font.measureText(text);

  const xOffset = -fontSize.width / 2 - fontSize.x;
  const yOffset = fontSize.height / 4; // TODO: Not a perfect center

  return { xOffset, yOffset };
}
