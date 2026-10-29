import { create } from 'zustand';
import type { ThemeMode } from '@/theme';

/**
 * App-wide client UI state.
 *
 * Rules (from AGENTS.md):
 * - Zustand is strictly for shared client-side UI preferences or transient flows.
 * - Never use Zustand as a duplicate server cache for data managed by TanStack Query.
 */

export interface AppState {
  themeMode: ThemeMode;
  isOffline: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setIsOffline: (isOffline: boolean) => void;
  resetAppStore: () => void;
}

const initialState = {
  themeMode: 'light' as ThemeMode,
  isOffline: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setThemeMode: (mode) => set({ themeMode: mode }),
  setIsOffline: (isOffline) => set({ isOffline }),
  resetAppStore: () => set(initialState),
}));

// Selectors for optimized subscriptions
export const selectThemeMode = (state: AppState) => state.themeMode;
export const selectIsOffline = (state: AppState) => state.isOffline;
export const selectSetThemeMode = (state: AppState) => state.setThemeMode;
