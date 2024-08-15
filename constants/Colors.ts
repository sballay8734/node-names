import { Theme } from "@react-navigation/native";

import { ITheme } from "@/components/CustomThemeContext";

export type CustomTheme = ITheme & Partial<Theme>;

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
