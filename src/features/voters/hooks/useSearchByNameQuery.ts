import { useQuery } from '@tanstack/react-query';
import { VoterService } from '../services/voter.service';
import type { SearchVotersResponse } from '../types/voter.types';
import { voterKeys } from './useAllVotersQuery';

/**
 * TanStack Query hook to search voters by name.
 * Runs only when a search query is provided.
 */
export function useSearchByNameQuery(name: string) {
  const trimmedName = name.trim();

  return useQuery<SearchVotersResponse, Error>({
    queryKey: voterKeys.search(trimmedName),
    queryFn: ({ signal }) => VoterService.searchByName(trimmedName, signal),
    enabled: trimmedName.length > 0,
    staleTime: 30 * 1000, // Cache search results for 30 seconds
  });
}

