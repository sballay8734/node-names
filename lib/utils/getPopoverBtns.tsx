import { Dispatch } from "@reduxjs/toolkit";

import {
  createNewGroup,
  createNewNode,
  createSubGroupFromSelection,
  moveNode,
} from "@/features/Graph/redux/graphSlice";
import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";

import { WindowSize } from "../types/misc";

type Action =
  | "createNewNode"
  | "createNewGroup"
  | "createSubGroupFromSelection"
  | "move"
  | "error";

export type Rule = "any" | "none" | "multiple" | "single" | "error";

export interface OptionsObj {
  text: string;
  iconName: string;
  // action: Action;

  // !TODO: Need to type this action properly so that it only accepts a dispatch function that is dispatching something from a slice
  action: any;
  initialX: number;
  initialY: number;
  finalX: number;
  finalY: number;
  visibilityRule: Rule;
}

const SPACING = 10;

export function getPopoverBtns(windowSize: WindowSize) {
  const windowHeight = windowSize.height;
  const initialPosition = {
    x: 0,
    y: windowHeight,
  };
  const POPOVER_BTNS: OptionsObj[] = [
    {
      text: "Create a new node",
      iconName: "person-add-alt-1",
      action: "createNewNode",
      initialX: initialPosition.x,
      initialY: initialPosition.y,
      finalX: -50,
      finalY: windowHeight - TAB_BAR_HEIGHT + SPACING,
      visibilityRule: "any",
    },
    {
      text: "Create a new group",
      iconName: "group-add",
      action: "createNewGroup",
      initialX: initialPosition.x,
      initialY: initialPosition.y,
      finalX: 0,
      finalY: windowHeight - TAB_BAR_HEIGHT - SPACING,
      visibilityRule: "none",
    },
    {
      text: "Create sub group from selection",
      iconName: "group-work",
      action: "createSubGroupFromSelection",
      initialX: initialPosition.x,
      initialY: initialPosition.y,
      finalX: 50,
      finalY: windowHeight - TAB_BAR_HEIGHT + SPACING,
      visibilityRule: "multiple",
    },
    {
      text: "Move node to another group",
      iconName: "account-balance-wallet",
      action: "move",
      initialX: initialPosition.x,
      initialY: initialPosition.y,
      finalX: 0,
      finalY: windowHeight - TAB_BAR_HEIGHT - 50 - SPACING,
      visibilityRule: "single",
    },
  ];

  return POPOVER_BTNS;
}

// !TODO: Change all icons to custom icons
