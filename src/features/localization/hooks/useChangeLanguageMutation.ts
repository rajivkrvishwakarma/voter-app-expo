import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LocalizationService } from '../services/localization.service';
import { localizationKeys } from './useLanguagesQuery';
import type { ChangeLanguagePayload, ChangeLanguageResponse } from '../types/localization.types';

export function useChangeLanguageMutation() {
  const queryClient = useQueryClient();

  return useMutation<ChangeLanguageResponse['data'], Error, ChangeLanguagePayload>({
    mutationFn: (payload: ChangeLanguagePayload) => LocalizationService.changeLanguage(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(localizationKeys.languages(), data);
      void queryClient.invalidateQueries({ queryKey: localizationKeys.languages() });
    },
  });
}

