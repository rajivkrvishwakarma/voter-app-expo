import React, { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppError } from '@/services/api/errors';

export interface QueryProviderProps {
  children: ReactNode;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10,   // 10 minutes
        refetchOnWindowFocus: false, // Avoid aggressive background refetching in mobile
        retry: (failureCount, error) => {
          // Only retry transient errors up to 2 times
          if (failureCount >= 2) return false;
          if (error instanceof AppError) {
            return error.isTransient;
          }
          return false;
        },
      },
      mutations: {
        retry: false, // Never retry mutations blindly unless idempotent
      },
    },
  });
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Use state to ensure client is only instantiated once per app lifecycle
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
