import { Theme } from "@react-navigation/native";

import { ITheme } from "@/components/CustomThemeContext";

export type CustomTheme = ITheme & Partial<Theme>;

export const TAB_BG_COLOR = "rgba(9, 9, 9, 1)";

const DefTheme: ITheme = {
  bgBase: "rgba(13, 13, 13, 1)",
  bgBaseTest: "rgba(9, 9, 9, 1)",
  bgLighter: "rgba(20, 20, 20, 1)",
  borderBase: "rgba(34, 34, 34, 1)",

  btnBase: "rgba(25, 25, 25, 1)",
  btnBasePressed: "rgba(25, 25, 25, 0.7)", // REVIEW:
  btnBaseSelected: "rgba(48, 24, 13, 1)",
  btnText: "rgba(68, 68, 68, 1)",
  btnTextSelected: "rgba(245, 84, 8, 1)",

  tabBarActiveTint: "#fff",

  primary: "rgba(245, 84, 8, 1)",

  textPrimary: "rgba(246, 246, 246, 1)",
  textFadedSm: "rgba(132, 132, 135, 1)",
  textFadedMd: "rgba(73, 73, 73, 1)",

  groupTitleText: "rgba(178, 178, 178, 1)",
  groupTitleOutline: "rgba(9, 9, 9, 1)",

  grp1NodeBg: "rgba(255, 190, 25, 1)",
  grp2NodeBg: "rgba(15, 175, 255, 1)",
  grp3NodeBg: "rgba(245, 61, 48, 1)",
  grp4NodeBg: "rgba(48, 245, 107, 1)",
  grp5NodeBg: "rgba(189, 48, 245, 1)",

  // node inactive

  // node sourceIsSelected

  // node isSelected
};

export const nodeBgMap: { [key: number]: string } = {
  // inactive
  1: "rgba(83, 64, 14, 1)", // yellow
  2: "rgba(11, 59, 83, 1)", // blue
  3: "rgba(80, 25, 21, 1)", // red
  4: "rgba(21, 80, 39, 1)", // green
  5: "rgba(30, 33, 82, 1)", // purple

  // source active
  11: "rgba(255, 190, 25, 1)",
  22: "rgba(15, 175, 255, 1)",
  33: "rgba(245, 61, 48, 1)",
  44: "rgba(48, 245, 107, 1)",
  55: "rgba(189, 48, 245, 1)",

  // active
  111: "rgba(255, 190, 25, 1)",
  222: "rgba(15, 175, 255, 1)",
  333: "rgba(245, 61, 48, 1)",
  444: "rgba(48, 245, 107, 1)",
  555: "rgba(189, 48, 245, 1)",
};

export default DefTheme;

// NEW STUFF BELOW *************************************************************

export const GRAPH_BG_COLOR = "#080a0f";

export interface NormalizedGroupColors {
  [key: string]: string;
}

export function normalizeUserGroupColors(
  userGroups: Record<string, string>,
): NormalizedGroupColors {
  return Object.entries(userGroups).reduce((acc, [groupName, color]) => {
    acc[groupName] = color;
    return acc;
  }, {} as NormalizedGroupColors);
}

// Example usage:
const userGroupNames = {
  Root: "rgba(89, 173, 246, 1)", // blue

  Friends: "rgba(248, 243, 141, 1)", // yellow
  Work: "rgba(255, 180, 128, 1)", // orange
  School: "rgba(157, 148, 255, 1)", // purple
  Family: "rgba(199, 128, 232, 1)", // pink
  Online: "rgba(8, 202, 209, 1)", // teal
  Group6: "rgba(255, 105, 97, 1)", // red
  Fallback: "rgba(66, 214, 164, 1)", // green
};

const normalizedColors = normalizeUserGroupColors(userGroupNames);

export const BORDER_COLORS = {
  Root: "rgba(89, 173, 246, 1)", // blue

  Friends: "rgba(248, 243, 141, 1)", // yellow
  Work: "rgba(255, 180, 128, 1)", // orange
  School: "rgba(157, 148, 255, 1)", // purple
  Family: "rgba(199, 128, 232, 1)", // pink
  Online: "rgba(8, 202, 209, 1)", // teal
  Group6: "rgba(255, 105, 97, 1)", // red
  Fallback: "rgba(66, 214, 164, 1)", // green
};

export const OPACITY = {
  active: 1,
  parent_active: 0.4,
  inactive: 0.1,
};

export const TEXT_COLOR = "#adafb3";
export const ROOT_TEXT_COLOR = "#0d0d0d";

const ROOT_TEXT_COLORS = {
  active: "#082945",
  parent_active: "#082945",
  inactive: "#1b5687",
};

export const TEXT_OPACITY = {
  active: 1,
  parent_active: 0.3,
  inactive: 0.1,
};

export const LINK_OPACITY = {
  active: 0.1, // this is if parent is active
  parent_active: 0.1,
  inactive: 0,
};

export const LINK_COLORS: { [key: string]: string } = {
  Root: "rgba(89, 173, 246, 1)", // blue

  Friends: "rgba(248, 243, 141, 1)", // yellow
  Work: "rgba(255, 180, 128, 1)", // orange
  School: "rgba(157, 148, 255, 1)", // purple
  Family: "rgba(199, 128, 232, 1)", // pink
  Online: "rgba(8, 202, 209, 1)", // teal
  Group6: "rgba(255, 105, 97, 1)", // red
  Fallback: "rgba(66, 214, 164, 1)", // green
};

type NodeStatus = "active" | "inactive" | "parent_active";

export const getNodeStyles = (
  nodeStatus: NodeStatus,
  groupName: string,
  isRoot?: boolean,
) => {
  const baseColor = normalizedColors[groupName] || normalizedColors["Fallback"];
  const opacity = OPACITY[nodeStatus] || OPACITY.inactive;

  const fillColor = `${baseColor.replace(/[^,]+(?=\))/, opacity.toString())}`;
  const textColor = isRoot
    ? ROOT_TEXT_COLORS[nodeStatus]
    : nodeStatus === "active"
    ? normalizedColors[groupName]
    : TEXT_COLOR;
  const textOpacity = TEXT_OPACITY[nodeStatus] || TEXT_OPACITY.inactive;
  const borderColor =
    nodeStatus === "parent_active" ? fillColor : "transparent";

  return {
    fillColor,
    borderColor,
    textColor,
    textOpacity,
  };
};
