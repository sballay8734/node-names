import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

import { TAB_BAR_HEIGHT } from "@/lib/constants/styles";

// !TODO: This call to Dimensions should not happen
const windowHeight = Dimensions.get("window").height - TAB_BAR_HEIGHT;
const EXTENSION = 10;

const INITIAL_POSITION = {
  x: 0,
  y: windowHeight,
};

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
  action: Action;
  initialX: number;
  initialY: number;
  finalX: number;
  finalY: number;
  visibilityRule: Rule;
  // isVisibleCondition: (count: number, isRootSelected: boolean) => boolean;
}

export const POPOVER_OPTIONS: OptionsObj[] = [
  {
    text: "Create a new node",
    iconName: "person-add-alt-1",
    // icon: <MaterialIcons name="person-add-alt-1" size={18} color="#170038" />,
    action: "createNewNode",
    initialX: INITIAL_POSITION.x,
    initialY: INITIAL_POSITION.y,
    finalX: -50,
    finalY: windowHeight - TAB_BAR_HEIGHT + EXTENSION,
    visibilityRule: "any",
  },
  {
    text: "Create a new group",
    iconName: "group-add",
    // icon: <MaterialIcons name="group-add" size={18} color="#170038" />,
    action: "createNewGroup",
    initialX: INITIAL_POSITION.x,
    initialY: INITIAL_POSITION.y,
    finalX: 0,
    finalY: windowHeight - TAB_BAR_HEIGHT - EXTENSION,
    visibilityRule: "none",
  },
  {
    text: "Create sub group from selection",
    iconName: "group-work",
    // icon: <MaterialIcons name="group-work" size={18} color="#170038" />,
    action: "createSubGroupFromSelection",
    initialX: INITIAL_POSITION.x,
    initialY: INITIAL_POSITION.y,
    finalX: 50,
    finalY: windowHeight - TAB_BAR_HEIGHT + EXTENSION,
    visibilityRule: "multiple",
  },
  {
    text: "Move node to another group",
    iconName: "account-balance-wallet",
    // icon: (
    //   <MaterialIcons name="account-balance-wallet" size={18} color="#170038" />
    // ),
    action: "move",
    initialX: INITIAL_POSITION.x,
    initialY: INITIAL_POSITION.y,
    finalX: 0,
    finalY: windowHeight - TAB_BAR_HEIGHT - 50 - EXTENSION,
    visibilityRule: "single",
  },
  // {
  //   text: "ERROR: Can only connect root to a NEW node/group",
  //   iconName: "error",
  //   // icon: <MaterialIcons name="error" size={18} color="red" />,
  //   action: "error",
  //   initialX: INITIAL_POSITION.x,
  //   initialY: INITIAL_POSITION.y,
  //   finalX: 0,
  //   finalY: windowHeight - TAB_BAR_HEIGHT - EXTENSION,
  //   visibilityRule: "error",
  // },
];

// !TODO: Change all icons to custom icons
