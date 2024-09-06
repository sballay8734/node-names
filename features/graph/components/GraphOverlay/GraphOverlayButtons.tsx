import React from "react";
import { DerivedValue, SharedValue } from "react-native-reanimated";

import BackToUserBtn from "@/features/Graph/components/GraphOverlay/BackToUserBtn";
import InspectBtn from "@/features/Graph/components/GraphOverlay/InspectBtn";
import RecenterBtn from "@/features/Graph/components/GraphOverlay/RecenterBtn";
import SearchBar from "@/features/Graph/components/GraphOverlay/SearchBar";
import { useGestures } from "@/lib/hooks/useGestures";
import { useGraphData } from "@/lib/hooks/useGraphData";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

import DeselectAllBtn from "./DeselectAllBtn";
import Popover from "./Popover";

interface Props {
  arrowData: DerivedValue<{ transform: { rotate: string }[] }>;
  showArrow: SharedValue<boolean>;
  centerOnRoot: () => void;
}

const GraphOverlayButtons = () => {
  const windowSize = useAppSelector((state: RootState) => state.windowSize);
  const { scale, translateX, translateY, lastScale } = useGestures();
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
