import { Theme } from "@react-navigation/native";

import { ITheme } from "@/components/CustomThemeContext";

export type CustomTheme = ITheme & Partial<Theme>;

const DefTheme: ITheme = {
  bgBase: "rgba(13, 13, 13, 1)",
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

  // node inactive

  // node sourceIsSelected

  // node isSelected
};

export default DefTheme;
