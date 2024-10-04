import React from "react";
import { SharedValue } from "react-native-reanimated";

import BackToUserBtn from "@/features/Graph/components/GraphOverlay/BackToUserBtn";
import InspectBtn from "@/features/Graph/components/GraphOverlay/InspectBtn";
import RecenterBtn from "@/features/Graph/components/GraphOverlay/RecenterBtn";
import SearchBar from "@/features/Graph/components/GraphOverlay/SearchBar";
import { GestureContextType } from "@/lib/context/gestures";
import { WindowSize } from "@/lib/types/misc";

import Popover from "../Popover/Popover";

import DeselectAllBtn from "./DeselectAllBtn";
import AddBtn from "./AddBtn";

interface GraphOverlayButtonsProps {
  gestures: GestureContextType;
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
      <AddBtn gestures={gestures} windowSize={windowSize} />
      {/* <BackToUserBtn /> */}
    </>
  );
};

export default GraphOverlayButtons;
