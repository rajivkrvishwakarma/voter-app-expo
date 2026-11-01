import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { GetAllVotersResponse, SearchVotersResponse } from '../types/voter.types';

export const VoterService = {
  /**
   * Retrieves all voters list from the backend API.
   */
  async getAllVoters(): Promise<GetAllVotersResponse> {
    const response = await apiClient.get<GetAllVotersResponse>(
      API_ENDPOINTS.voters.allVoters
    );
    return response.data;
  },

  /**
   * Searches voters by name from the backend API.
   */
  async searchByName(name: string, signal?: AbortSignal): Promise<SearchVotersResponse> {
    const response = await apiClient.get<SearchVotersResponse>(
      API_ENDPOINTS.voters.searchByName,
      {
        params: { name },
        signal,
      }
    );
    return response.data;
  },
};

