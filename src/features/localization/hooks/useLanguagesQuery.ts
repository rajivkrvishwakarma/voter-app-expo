import { useQuery } from '@tanstack/react-query';
import { LocalizationService } from '../services/localization.service';
import type { LanguagesData } from '../types/localization.types';

export const localizationKeys = {
  all: ['localization'] as const,
  languages: () => [...localizationKeys.all, 'languages'] as const,
};

export function useLanguagesQuery() {
  return useQuery<LanguagesData, Error>({
    queryKey: localizationKeys.languages(),
    queryFn: () => LocalizationService.getLanguages(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

