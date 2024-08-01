import { Line, Paint } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { ILink } from "@/features/D3/types/d3Types";

interface Props {
  link: ILink;
  shouldShow: boolean;
}

export default function Link({ link, shouldShow }: Props): React.JSX.Element {
  const opacity = useSharedValue(0.05);

  useEffect(() => {
    opacity.value = withTiming(shouldShow ? 1 : 0.05, { duration: 300 });
  }, [shouldShow, opacity]);

  return (
    <Line
      p1={{ x: link.source.x, y: link.source.y }}
      p2={{ x: link.target.x, y: link.target.y }}
      // color="transparent"
      // style="stroke"
      // strokeWidth={1}
    >
      <Paint
        color={"rgba(245, 240, 196, 1)"}
        opacity={opacity}
        strokeWidth={1}
        style="stroke"
        strokeCap="round"
      />
    </Line>
  );
}