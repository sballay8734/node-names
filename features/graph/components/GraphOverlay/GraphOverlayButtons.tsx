import React from "react";
import { SharedValue } from "react-native-reanimated";

import BackToUserBtn from "@/features/Graph/components/GraphOverlay/BackToUserBtn";
import InspectBtn from "@/features/Graph/components/GraphOverlay/InspectBtn";
import RecenterBtn from "@/features/Graph/components/GraphOverlay/RecenterBtn";
import SearchBar from "@/features/Graph/components/GraphOverlay/SearchBar";
import { useGraphData } from "@/lib/hooks/useGraphData";
import { WindowSize } from "@/lib/types/misc";

import DeselectAllBtn from "./DeselectAllBtn";
import Popover from "./Popover";

interface Props {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  lastScale: SharedValue<number>;
  windowSize: WindowSize;
}

const GraphOverlayButtons = ({
  scale,
  translateX,
  translateY,
  lastScale,
  windowSize,
}: Props) => {
  const { arrowData, showArrow, centerOnRoot } = useGraphData({
    scale,
    translateX,
    translateY,
    windowSize,
    lastScale,
  });

  return (
    <>
      <Popover />
      <SearchBar />
      <RecenterBtn
        centerOnRoot={centerOnRoot}
        arrowData={arrowData}
        showArrow={showArrow}
      />
      <DeselectAllBtn />
      <InspectBtn centerOnRoot={centerOnRoot} />
      <BackToUserBtn />
    </>
  );
};

export default GraphOverlayButtons;
