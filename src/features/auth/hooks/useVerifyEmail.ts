import { useMutation } from '@tanstack/react-query';
import { VerifiedEmailService } from '../services/verifiedEmail.service';
import type { VerifyEmailResult } from '../types/auth.types';

export interface VerifyEmailMutationVariables {
  chosenEmail?: string;
}

export function useVerifyEmailMutation() {
  return useMutation<VerifyEmailResult, Error, VerifyEmailMutationVariables | undefined>({
    mutationFn: async (variables) => {
      // 1. Obtain digital credential from Android Credential Manager (or interactive consent)
      const credential = await VerifiedEmailService.requestCredential(variables?.chosenEmail);

      // 2. Submit raw credential and nonce to backend for cryptographic verification
      const verifiedResult = await VerifiedEmailService.verifyWithBackend(credential);

      return verifiedResult;
    },
  });
}
