import React, { createContext, useContext } from "react";

export interface ITheme {
  bgBase: string;
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
}

const CustomThemeContext = createContext<ITheme | undefined>(undefined);

export const TAB_BG_COLOR = "rgba(20, 20, 20, 1)";

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
