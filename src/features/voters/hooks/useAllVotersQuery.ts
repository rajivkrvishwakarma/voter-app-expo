import { useQuery } from '@tanstack/react-query';
import { VoterService } from '../services/voter.service';
import type { GetAllVotersResponse } from '../types/voter.types';

export const voterKeys = {
  all: ['voters'] as const,
  list: () => [...voterKeys.all, 'list'] as const,
  search: (name: string) => [...voterKeys.all, 'search', name] as const,
};

export function useAllVotersQuery() {
  return useQuery<GetAllVotersResponse, Error>({
    queryKey: voterKeys.list(),
    queryFn: () => VoterService.getAllVoters(),
    staleTime: 60 * 1000, // Cache for 1 minute
  });
}

