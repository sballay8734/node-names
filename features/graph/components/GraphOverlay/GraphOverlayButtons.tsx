import React from "react";
import { SharedValue } from "react-native-reanimated";

import BackToUserBtn from "@/features/Graph/components/GraphOverlay/BackToUserBtn";
import InspectBtn from "@/features/Graph/components/GraphOverlay/InspectBtn";
import RecenterBtn from "@/features/Graph/components/GraphOverlay/RecenterBtn";
import SearchBar from "@/features/Graph/components/GraphOverlay/SearchBar";
import { WindowSize } from "@/lib/types/misc";

import DeselectAllBtn from "./DeselectAllBtn";
import Popover from "./Popover";

interface GraphOverlayButtonsProps {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  lastScale: SharedValue<number>;
  initialFocalX: SharedValue<number>;
  initialFocalY: SharedValue<number>;
  scaleDelta: SharedValue<number>;
  windowSize: WindowSize;
}

const GraphOverlayButtons = ({
  scale,
  translateX,
  translateY,
  lastScale,
  initialFocalX,
  initialFocalY,
  scaleDelta,
  windowSize,
}: GraphOverlayButtonsProps) => {
  return (
    <>
      <Popover />
      <SearchBar />
      <RecenterBtn
        scale={scale}
        translateX={translateX}
        translateY={translateY}
        lastScale={lastScale}
        initialFocalX={initialFocalX}
        initialFocalY={initialFocalY}
        scaleDelta={scaleDelta}
        windowSize={windowSize}
      />
      <DeselectAllBtn />
      <InspectBtn />
      <BackToUserBtn />
    </>
  );
};

export default GraphOverlayButtons;
