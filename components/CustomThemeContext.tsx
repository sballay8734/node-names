import React, { createContext } from "react";

import DefTheme from "@/constants/Colors";

export interface ITheme {
  bgBase: string;
  bgBaseTest: string;
  bgLighter: string;
  borderBase: string;
  btnBase: string;
  btnBasePressed: string;
  btnBaseSelected: string;
  btnText: string;
  btnTextSelected: string;
  tabBarActiveTint: string;
  primary: string;

  textPrimary: string;
  textFadedSm: string;
  textFadedMd: string;

  groupTitleText: string;
  groupTitleOutline: string;

  grp1NodeBg: string;
  grp2NodeBg: string;
  grp3NodeBg: string;
  grp4NodeBg: string;
  grp5NodeBg: string;
}

export const TAB_BG_COLOR = "rgba(9, 9, 9, 1)";

// THEME SETTING **************************************************************
export const CustomThemeContext = createContext<ITheme>(DefTheme);

export const CustomThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <CustomThemeContext.Provider value={DefTheme}>
      {children}
    </CustomThemeContext.Provider>
  );
};
