import { useQuery } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '../types/auth.types';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export function useCurrentUserQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery<User, Error>({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const user = await AuthService.getLoginUser();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
}

