import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type {
  GetLanguagesResponse,
  LanguagesData,
  ChangeLanguagePayload,
  ChangeLanguageResponse,
} from '../types/localization.types';

export const LocalizationService = {
  /**
   * Fetches the supported languages and current active language from the server.
   */
  async getLanguages(): Promise<LanguagesData> {
    const response = await apiClient.get<GetLanguagesResponse>(
      API_ENDPOINTS.localization.languages
    );
    return response.data.data;
  },

  /**
   * Updates the active language on the server.
   */
  async changeLanguage(payload: ChangeLanguagePayload): Promise<ChangeLanguageResponse['data']> {
    const response = await apiClient.post<ChangeLanguageResponse>(
      API_ENDPOINTS.localization.changeLanguage,
      payload
    );
    return response.data.data;
  },
};

