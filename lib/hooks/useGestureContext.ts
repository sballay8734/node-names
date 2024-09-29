import { useContext } from "react";

import { GestureContext } from "../context/gestures";

export const useGestureContext = () => {
  const currentGestureContext = useContext(GestureContext);

  if (!currentGestureContext) {
    throw new Error(
      "useGestures has to be used within <GestureContext.Provider>",
    );
  }

  return currentGestureContext;
};
