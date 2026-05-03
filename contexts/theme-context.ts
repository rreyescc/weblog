import { createContext } from "react";

type ThemeContextType = {
  theme: string,
  setDarkTheme: () => void,
  setLightTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setDarkTheme: () => {},
  setLightTheme: () => {}
});