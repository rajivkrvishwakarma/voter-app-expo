import React, { type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root Application Providers composition wrapper.
 * Composes SafeAreaProvider, QueryProvider, and ThemeProvider in a deterministic hierarchy.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
