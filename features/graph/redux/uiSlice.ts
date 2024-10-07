import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FormKey = "firstName" | "lastName" | "newGroupName";

// Define a type for the slice state
interface UiSliceState {
  popoverIsShown: boolean;
  sheetIsShown: boolean;
  formInfo: Record<FormKey, string>;
}

// Define the initial state using that type
const initialState: UiSliceState = {
  popoverIsShown: false,
  sheetIsShown: false,
  formInfo: {
    firstName: "",
    lastName: "",
    newGroupName: "",
  },
};

const UiSlice = createSlice({
  name: "uiSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // use this to toggle ******************************************************
    handlePopover: (state) => {
      state.popoverIsShown = !state.popoverIsShown;
    },
    handleSheet: (state) => {
      state.sheetIsShown = !state.sheetIsShown;
    },
    // use these for other actions *********************************************
    showPopover: (state) => {
      state.popoverIsShown = true;
    },
    hidePopover: (state) => {
      state.popoverIsShown = false;
    },

    showSheet: (state) => {
      state.sheetIsShown = true;
    },
    hideSheet: (state) => {
      state.sheetIsShown = false;
    },

    updateInput: (
      state,
      action: PayloadAction<{ key: FormKey; value: string }>,
    ) => {
      const { key, value } = action.payload;
      state.formInfo[key] = value;
    },
  },
});

export const {
  handlePopover,
  handleSheet,
  showPopover,
  hidePopover,
  showSheet,
  hideSheet,
  updateInput,
} = UiSlice.actions;

export default UiSlice.reducer;
