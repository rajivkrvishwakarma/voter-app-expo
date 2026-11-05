import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VoterService } from '../services/voter.service';
import type {
  UpdateSurveyDetailsPayload,
  UpdateSurveyDetailsResponse,
} from '../types/voter.types';
import { voterKeys } from './useAllVotersQuery';
import { triggerAlert } from '@/store/alert.store';

export function useUpdateSurveyDetailsMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSurveyDetailsResponse,
    Error,
    UpdateSurveyDetailsPayload
  >({
    mutationFn: (payload) => VoterService.updateSurveyDetails(payload),
    onSuccess: (data, variables) => {
      // Invalidate individual voter detail query so fresh data is fetched immediately
      void queryClient.invalidateQueries({
        queryKey: voterKeys.detail(variables.voter_id),
      });
      if (variables.voter_id_field) {
        void queryClient.invalidateQueries({
          queryKey: voterKeys.detail(undefined, variables.voter_id_field),
        });
      }
      // Invalidate general list queries to reflect updated details
      void queryClient.invalidateQueries({
        queryKey: voterKeys.all,
      });

      triggerAlert.success(
        'Updated Successfully',
        data.message || 'Voter details updated successfully.'
      );
    },
    onError: (error) => {
      triggerAlert.error(
        'Update Failed',
        error.message || 'Failed to update voter details. Please try again.'
      );
    },
  });
}

