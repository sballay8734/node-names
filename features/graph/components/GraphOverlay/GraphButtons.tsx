import React from "react";
import { DerivedValue, SharedValue } from "react-native-reanimated";

import BackToUserBtn from "@/features/Graph/components/GraphOverlay/BackToUserBtn";
import InspectBtn from "@/features/Graph/components/GraphOverlay/InspectBtn";
import RecenterBtn from "@/features/Graph/components/GraphOverlay/RecenterBtn";
import SearchBar from "@/features/Graph/components/GraphOverlay/SearchBar";

import DeselectAllBtn from "./DeselectAllBtn";
import Popover from "./Popover";

interface Props {
  arrowData: DerivedValue<{ transform: { rotate: string }[] }>;
  showArrow: SharedValue<boolean>;
  centerOnRoot: () => void;
}

const GraphButtons = ({ arrowData, showArrow, centerOnRoot }: Props) => (
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

export default GraphButtons;
