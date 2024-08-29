import React from "react";
import { DerivedValue, SharedValue } from "react-native-reanimated";

import SearchBar from "@/features/Graph/components/SearchBar";
import BackToUserBtn from "@/features/GraphActions/components/BackToUserBtn";
import DeselectAllBtn from "@/features/GraphActions/components/DeselectAllBtn";
import InspectBtn from "@/features/GraphActions/components/InspectBtn";
import RecenterBtn from "@/features/GraphActions/components/RecenterBtn";

import Popover from "./Popover";

interface Props {
  arrowData: DerivedValue<{ transform: { rotate: string }[] }>;
  showArrow: SharedValue<boolean>;
  centerOnRoot: () => void;
}

const ControlButtons = ({ arrowData, showArrow, centerOnRoot }: Props) => (
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

export default ControlButtons;
