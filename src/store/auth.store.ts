import { create } from 'zustand';
import type { User, Politician } from '@/features/auth/types/auth.types';
import { TokenStorage } from '@/features/auth/services/token.storage';
import { AuthService } from '@/features/auth/services/auth.service';

export interface AuthState {
  token: string | null;
  user: User | null;
  politician: Politician | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  setAuthSession: (token: string, user: User, politician?: Politician | null) => void;
  setUser: (user: User) => void;
  setPolitician: (politician: Politician) => void;
  initializeSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  politician: null,
  isAuthenticated: false,
  isLoadingSession: true,

  setAuthSession: (token, user, politician = null) => {
    set({
      token,
      user,
      politician,
      isAuthenticated: true,
      isLoadingSession: false,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  setPolitician: (politician) => {
    set({ politician });
  },

  initializeSession: async () => {
    try {
      const token = await TokenStorage.getToken();
      if (!token) {
        set({ isAuthenticated: false, isLoadingSession: false, token: null, user: null, politician: null });
        return;
      }

      const { user, politician } = await TokenStorage.getAuthMetadata<User, Politician>();
      set({
        token,
        user,
        politician,
        isAuthenticated: true,
        isLoadingSession: false,
      });
    } catch {
      set({ isAuthenticated: false, isLoadingSession: false, token: null, user: null, politician: null });
    }
  },

  logout: async () => {
    await AuthService.logout();
    set({
      token: null,
      user: null,
      politician: null,
      isAuthenticated: false,
      isLoadingSession: false,
    });
  },
}));

