import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, type AppTheme, type ThemeMode } from '@/theme';
import { useAppStore, selectThemeMode, selectSetThemeMode } from '@/store/app.store';

export interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppStore(selectThemeMode);
  const setThemeMode = useAppStore(selectSetThemeMode);

  const activeTheme = useMemo(() => {
    return getTheme(themeMode, systemColorScheme);
  }, [themeMode, systemColorScheme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme: activeTheme,
    isDark: activeTheme.isDark,
    themeMode,
    setThemeMode,
  }), [activeTheme, themeMode, setThemeMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Access the active theme tokens, themeMode, and setter.
 */
export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
