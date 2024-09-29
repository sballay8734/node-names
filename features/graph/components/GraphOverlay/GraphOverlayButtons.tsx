import React from "react";
import { SharedValue } from "react-native-reanimated";

import BackToUserBtn from "@/features/Graph/components/GraphOverlay/BackToUserBtn";
import InspectBtn from "@/features/Graph/components/GraphOverlay/InspectBtn";
import RecenterBtn from "@/features/Graph/components/GraphOverlay/RecenterBtn";
import SearchBar from "@/features/Graph/components/GraphOverlay/SearchBar";
import { WindowSize } from "@/lib/types/misc";

import Popover from "../Popover/Popover";

import DeselectAllBtn from "./DeselectAllBtn";

interface GraphOverlayButtonsProps {
  gestures: {
    scale: SharedValue<number>;
    translateX: SharedValue<number>;
    translateY: SharedValue<number>;
    lastScale: SharedValue<number>;
    initialFocalX: SharedValue<number>;
    initialFocalY: SharedValue<number>;
    centerShiftX: SharedValue<number>;
    centerShiftY: SharedValue<number>;
  };
  windowSize: WindowSize;
}

const GraphOverlayButtons = ({
  gestures,
  windowSize,
}: GraphOverlayButtonsProps) => {
  return (
    <>
      <Popover />
      <SearchBar />
      <RecenterBtn gestures={gestures} windowSize={windowSize} />
      <DeselectAllBtn />
      <InspectBtn />
      {/* <BackToUserBtn /> */}
    </>
  );
};

export default GraphOverlayButtons;
