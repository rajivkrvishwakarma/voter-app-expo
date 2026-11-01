import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { TokenStorage } from './token.storage';
import type {
  RegisterPayload,
  RegisterResponse,
  GetLoginUserResponse,
  GetBannerScreenResponse,
  User,
  Politician,
} from '../types/auth.types';

export const AuthService = {
  /**
   * Registers or authenticates a user using name, email, phone (optional), and reference_no.
   * On success, returns the user, authentication token, and politician details.
   */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.auth.register,
      payload
    );

    const data = response.data;

    // Persist token & auth info to SecureStore immediately
    if (data.token) {
      await TokenStorage.saveToken(data.token);
      await TokenStorage.saveAuthMetadata(data.user, data.politician);
    }

    return data;
  },

  /**
   * Fetches the currently authenticated user's profile details.
   */
  async getLoginUser(): Promise<User> {
    const response = await apiClient.get<GetLoginUserResponse>(
      API_ENDPOINTS.user.me
    );
    return response.data.login_users;
  },

  /**
   * Fetches politician and campaign banner data.
   */
  async getBannerScreen(): Promise<Politician> {
    const response = await apiClient.get<GetBannerScreenResponse>(
      API_ENDPOINTS.campaign.bannerScreen
    );
    return response.data.politician;
  },

  /**
   * Logs out the user and clears all credentials.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Allow logout to proceed even if the network call fails
    } finally {
      await TokenStorage.clearAll();
    }
  },
};

