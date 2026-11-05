import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type {
  GetAllVotersResponse,
  GetIndividualVoterDetailsResponse,
  SearchVotersResponse,
  UpdateSurveyDetailsPayload,
  UpdateSurveyDetailsResponse,
  Voter,
} from '../types/voter.types';

/**
 * Constructs a complete survey update payload by merging current voter state with specific overrides.
 */
export function buildSurveyUpdatePayload(
  voter: Voter,
  overrides: Partial<UpdateSurveyDetailsPayload>
): UpdateSurveyDetailsPayload {
  return {
    voter_id: voter.id,
    name: voter.name ?? '',
    father_name: voter.father_name ?? '',
    relation: voter.relation ?? '',
    acc_no: voter.acc_no ?? '',
    image: voter.image ?? '',
    gender: voter.gender ?? '',
    age: voter.age ?? 0,
    dob: voter.dob ?? '',
    voter_id_field: voter.voter_id ?? '',
    part_no: voter.part_no ?? '',
    srn: voter.srn ?? '',
    village: voter.village ?? '',
    address: voter.address ?? '',
    house_no: voter.house_no ?? '',
    cast: voter.cast ?? '',
    booth: voter.booth ?? '',
    mobile_1: voter.mobile_1 ?? '',
    mobile_2: voter.survey?.mobile_2 ?? '',
    email: voter.survey?.email ?? '',
    new_address: voter.survey?.new_address ?? '',
    color_code: voter.survey?.color_code ?? '',
    position: voter.survey?.position ?? '',
    personnel: voter.survey?.personnel ?? '',
    society: voter.survey?.society ?? '',
    date_of_birth: voter.survey?.date_of_birth ?? voter.dob ?? '',
    demands: voter.survey?.demands ?? '',
    dead: voter.survey?.dead === 1,
    is_voted: voter.survey?.is_voted === 1,
    star_voter: voter.survey?.star_voter === 1,
    extra_info_1: voter.extra_information?.extra_info_1 ?? '',
    extra_info_2: voter.extra_information?.extra_info_2 ?? '',
    extra_info_3: voter.extra_information?.extra_info_3 ?? '',
    extra_info_4: voter.extra_information?.extra_info_4 ?? '',
    extra_info_5: voter.extra_information?.extra_info_5 ?? '',
    extra_check_1: Boolean(voter.extra_information?.extra_check_1),
    extra_check_2: Boolean(voter.extra_information?.extra_check_2),
    ...overrides,
  };
}

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

  /**
   * Updates voter survey details via POST /api/survey-details-update.
   */
  async updateSurveyDetails(
    payload: UpdateSurveyDetailsPayload
  ): Promise<UpdateSurveyDetailsResponse> {
    const response = await apiClient.post<UpdateSurveyDetailsResponse>(
      API_ENDPOINTS.voters.surveyDetailsUpdate,
      payload
    );
    return response.data;
  },
};

