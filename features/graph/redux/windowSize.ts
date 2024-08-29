import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { WindowSize } from "@/lib/types/misc";

const getInitialWindowSize = (): WindowSize => {
  const { width, height } = Dimensions.get("window");
  const adjHeight = height - TAB_BAR_HEIGHT;
  return {
    width,
    height: adjHeight,
    windowCenterX: width / 2,
    windowCenterY: adjHeight / 2,
  };
};

const windowSizeSlice = createSlice({
  name: "windowSize",
  initialState: getInitialWindowSize(),
  reducers: {
    updateWindowSize: (state, action: PayloadAction<WindowSize>) => {
      return action.payload;
    },
  },
});

export const { updateWindowSize } = windowSizeSlice.actions;
export default windowSizeSlice.reducer;
