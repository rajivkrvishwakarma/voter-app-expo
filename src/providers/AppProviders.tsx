import React, { type ReactNode } from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root Application Providers composition wrapper.
 * Composes SafeAreaProvider, QueryProvider, and ThemeProvider in a deterministic hierarchy.
 * Providing initialMetrics ensures instant safe area inset calculation with zero top-layout jerk.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
