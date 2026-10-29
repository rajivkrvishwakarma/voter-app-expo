/**
 * Types and contracts for Google Verified Email via Android Credential Manager.
 */

export interface DigitalCredentialRequest {
  nonce: string;
  origin?: string;
}

export interface DigitalCredentialResponse {
  credential: string;
  nonce: string;
  email?: string;
}

export interface VerifyEmailResult {
  email: string;
  verified: boolean;
  verifiedAt: string;
  provider: 'google_credential_manager';
}

export interface GoogleAccountChoice {
  id: string;
  email: string;
  name: string;
  avatarColor?: string;
  avatarLetter?: string;
}

export interface CreateAccountFormValues {
  fullName: string;
  email: string;
  isEmailVerified: boolean;
}

export type AuthFlowStep =
  | 'form'           // Step 1: Open the form
  | 'consent'        // Step 2: Android consent sheet
  | 'processing'     // Step 3: Verifying your email...
  | 'verified_form'  // Step 4: Email auto-filled & verified
  | 'success';       // Step 5: Success screen
