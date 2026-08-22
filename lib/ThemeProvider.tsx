"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

const THEME_COOKIE = "dmif_theme";

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function persistTheme(theme: ThemeMode) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: ThemeMode;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    persistTheme(mode);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export { THEME_COOKIE };
