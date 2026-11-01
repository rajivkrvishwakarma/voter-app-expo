import { useQuery } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { Politician } from '../types/auth.types';

export const politicianKeys = {
  all: ['politician'] as const,
  banner: () => [...politicianKeys.all, 'banner'] as const,
};

export function usePoliticianBannerQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setPolitician = useAuthStore((state) => state.setPolitician);

  return useQuery<Politician, Error>({
    queryKey: politicianKeys.banner(),
    queryFn: async () => {
      const data = await AuthService.getBannerScreen();
      setPolitician(data);
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

