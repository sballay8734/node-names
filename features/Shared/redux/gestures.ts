import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const MIN_SCALE = 0.1;
const MAX_SCALE = 4;
export const INITIAL_SCALE = 0.3;
export const CENTER_ON_SCALE = 0.4;
const SCALE_SENSITIVITY = 1.2;

interface GesturesState {
  scale: number;
  translateX: number;
  translateY: number;
  lastScale: number;
  focalX: number;
  focalY: number;
  initialFocalX: number;
  initialFocalY: number;
}

const initialState: GesturesState = {
  scale: INITIAL_SCALE,
  translateX: 0,
  translateY: 0,
  lastScale: INITIAL_SCALE,
  focalX: 0,
  focalY: 0,
  initialFocalX: 0,
  initialFocalY: 0,
};

const gesturesSlice = createSlice({
  name: "gestures",
  initialState,
  reducers: {
    updateTranslate: (
      state,
      action: PayloadAction<{ x: number; y: number }>,
    ) => {
      state.translateX += action.payload.x;
      state.translateY += action.payload.y;
    },
    updateScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    updateLastScale: (state) => {
      state.lastScale = state.scale;
    },
    setInitialFocal: (
      state,
      action: PayloadAction<{ x: number; y: number }>,
    ) => {
      state.initialFocalX = action.payload.x;
      state.initialFocalY = action.payload.y;
    },
  },
});

export const {
  updateTranslate,
  updateScale,
  updateLastScale,
  setInitialFocal,
} = gesturesSlice.actions;
export default gesturesSlice.reducer;
