import { Canvas, Group, Path, Shadow } from "@shopify/react-native-skia";
import React from "react";

import { useCustomTheme } from "./CustomThemeContext";

interface Props {
  color: string;
  size: number;
}

const PlusIcon = ({ color, size }: Props) => {
  const strokeWidth = size * 0.02;
  const halfSize = size / 2;
  const theme = useCustomTheme();

  // create path for a thin plus sign
  const path = `M ${halfSize} ${strokeWidth} V ${
    size - strokeWidth
  } M ${strokeWidth} ${halfSize} H ${size - strokeWidth}`;

  return (
    <Canvas style={{ width: size, height: size }}>
      {/* Main plus sign with shadow effect */}
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={strokeWidth}
      ></Path>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={strokeWidth}
      />
    </Canvas>
  );
};

export default PlusIcon;
