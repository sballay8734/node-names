import { MaterialIcons } from "@expo/vector-icons";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";
import { WindowSize } from "@/lib/types/misc";

import {
  createNewGroup,
  createNewNode,
  createSubGroupFromSelection,
  moveNode,
} from "../../redux/graphSlice";

import { ActionType } from "./Action";

export type ActionObj = {
  source_id: number;
  ids_to_group: number[];
};

type PopoverActionMap = {
  // !TODO: TYPE THIS CORRECTLY
  [key: string]: any;
  // [key: string]: () => Dispatch<ActionFromReducer<any>>;
};

type ActionPosMap = {
  [key: string]: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  // [key: string]: () => Dispatch<ActionFromReducer<any>>;
};

// MAPS ************************************************************************

// ICON MAP
export const iconMap: { [key: string]: React.ReactNode } = {
  createNewNode: (
    <MaterialIcons name="person-add-alt-1" size={24} color="#170038" />
  ),
  createNewGroup: <MaterialIcons name="group-add" size={24} color="#170038" />,
  createSubGroupFromSelection: (
    <MaterialIcons name="group-work" size={24} color="#170038" />
  ),
  moveNode: (
    <MaterialIcons name="account-balance-wallet" size={24} color="#170038" />
  ),
  error: <MaterialIcons name="error" size={24} color="#170038" />,
};
// ACTION MAP
export const actionMap: PopoverActionMap = {
  createNewNode: createNewNode(),
  createNewGroup: createNewGroup(),
  createSubGroupFromSelection: createSubGroupFromSelection(),
  moveNode: moveNode(),
};

// POSITION MAP
const SPACING = 10;
export function getPosValues(windowSize: WindowSize) {
  const windowHeight = windowSize.height;

  const actionBtnPositionMap: ActionPosMap = {
    moveNode: {
      startX: 0,
      startY: windowHeight,
      endX: -50,
      endY: windowHeight - TAB_BAR_HEIGHT + SPACING,
    },
    createNewGroup: {
      startX: 0,
      startY: windowHeight,
      endX: 0,
      endY: windowHeight - TAB_BAR_HEIGHT - SPACING,
    },
    createSubGroupFromSelection: {
      startX: 0,
      startY: windowHeight,
      endX: 50,
      endY: windowHeight - TAB_BAR_HEIGHT + SPACING,
    },
    createNewNode: {
      startX: 0,
      startY: windowHeight,
      endX: 0,
      endY: windowHeight - TAB_BAR_HEIGHT - 50 - SPACING,
    },
  };

  return actionBtnPositionMap;
}

// ICON STATUS MAP
export function getBtnStatus(action: ActionType) {}
