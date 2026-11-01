import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { RegisterPayload, RegisterResponse } from '../types/auth.types';

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => AuthService.register(payload),
    onSuccess: (data) => {
      // Update global client session state
      if (data.token && data.user) {
        setAuthSession(data.token, data.user, data.politician);
      }
      // Invalidate current user query cache
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
}

