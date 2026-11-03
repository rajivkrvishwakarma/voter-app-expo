import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type {
  GetAllVotersResponse,
  GetIndividualVoterDetailsResponse,
  SearchVotersResponse,
} from '../types/voter.types';

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

  /**
   * Retrieves full details of an individual voter by ID from the backend API.
   */
  async getIndividualVoterDetails(
    params: { id?: number | string; voter_id?: string },
    signal?: AbortSignal
  ): Promise<GetIndividualVoterDetailsResponse> {
    const queryParams: Record<string, string> = {};
    if (params.id !== undefined && params.id !== null) {
      queryParams.id = String(params.id);
    }
    if (params.voter_id) {
      queryParams.voter_id = params.voter_id;
    }

    const response = await apiClient.get<GetIndividualVoterDetailsResponse>(
      API_ENDPOINTS.voters.individualDetails,
      {
        params: queryParams,
        signal,
      }
    );
    return response.data;
  },
};

