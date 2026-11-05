import { create } from 'zustand';
import type { User, Politician } from '@/features/auth/types/auth.types';
import { TokenStorage } from '@/features/auth/services/token.storage';
import { AuthService } from '@/features/auth/services/auth.service';
import { apiClient } from '@/services/api/client';
import { appQueryClient } from '@/providers/QueryProvider';
import { triggerAlert } from './alert.store';

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
  handleSessionExpired: () => Promise<void>;
}

let isHandlingSessionExpiry = false;

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
    appQueryClient.clear();
    set({
      token: null,
      user: null,
      politician: null,
      isAuthenticated: false,
      isLoadingSession: false,
    });
  },

  handleSessionExpired: async () => {
    if (isHandlingSessionExpiry) return;
    isHandlingSessionExpiry = true;

    try {
      await TokenStorage.clearAll();
      appQueryClient.clear();
      set({
        token: null,
        user: null,
        politician: null,
        isAuthenticated: false,
        isLoadingSession: false,
      });
      triggerAlert.warning('Session Expired', 'Please log in again to continue.');
    } finally {
      setTimeout(() => {
        isHandlingSessionExpiry = false;
      }, 2500);
    }
  },
}));

// Automatically hook into global API 401 unauthenticated events
apiClient.setOnUnauthorized(async (_message) => {
  await useAuthStore.getState().handleSessionExpired();
});


