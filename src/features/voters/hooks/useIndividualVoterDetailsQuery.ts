import { useQuery } from '@tanstack/react-query';
import { VoterService } from '../services/voter.service';
import type { GetIndividualVoterDetailsResponse } from '../types/voter.types';
import { voterKeys } from './useAllVotersQuery';

/**
 * TanStack Query hook to fetch full details of an individual voter.
 * Enabled only when an ID or voter_id is present.
 */
export function useIndividualVoterDetailsQuery(
  id?: number | string | null,
  voterId?: string | null
) {
  const isEnabled = (id !== null && id !== undefined) || (voterId !== null && voterId !== undefined && voterId.length > 0);

  return useQuery<GetIndividualVoterDetailsResponse, Error>({
    queryKey: voterKeys.detail(id, voterId),
    queryFn: ({ signal }) =>
      VoterService.getIndividualVoterDetails(
        {
          id: id ?? undefined,
          voter_id: voterId ?? undefined,
        },
        signal
      ),
    enabled: isEnabled,
    staleTime: 60 * 1000, // Cache individual profile for 1 minute
  });
}

