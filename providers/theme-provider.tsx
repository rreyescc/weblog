'use client'

import { useState } from "react"
import { ThemeContext } from "../contexts/theme-context"

export default function ThemeProvider({
  children
}: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const setDarkTheme = () => setTheme("dark");
  const setLightTheme = () => setTheme("light");

  return (
    <ThemeContext.Provider value={{ theme, setDarkTheme, setLightTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
