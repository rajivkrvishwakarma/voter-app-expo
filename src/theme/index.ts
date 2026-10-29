import { lightTheme, type AppTheme } from './light';
import { darkTheme } from './dark';

export * from './tokens';
export * from './light';
export * from './dark';

export type ThemeMode = 'light' | 'dark' | 'system';

export function getTheme(mode: ThemeMode, systemColorScheme: 'light' | 'dark' | null | undefined): AppTheme {
  if (mode === 'dark') return darkTheme;
  if (mode === 'light') return lightTheme;
  return systemColorScheme === 'dark' ? darkTheme : lightTheme;
}
