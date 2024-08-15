import React, { createContext, useContext } from "react";

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

const CustomThemeContext = createContext<ITheme | undefined>(undefined);

export const TAB_BG_COLOR = "rgba(9, 9, 9, 1)";

export const CustomThemeProvider: React.FC<{
  theme: ITheme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  return (
    <CustomThemeContext.Provider value={theme}>
      {children}
    </CustomThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
};
