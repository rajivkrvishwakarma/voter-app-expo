/**
 * Authentication & Registration Types and API Contracts
 */

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  reference_no: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  language?: string | null;
  googleId?: string | null;
  idToken?: string | null;
  photoUrl?: string | null;
  provider?: string | null;
  email_verified: boolean;
  email_verified_at?: string | null;
  image?: string | null;
  phone?: string | null;
  phone_verified?: boolean;
  otp_expires_at?: string | null;
  user_type: string;
  reference_no: string;
  password_reset_expires_at?: string | null;
  ip_address?: string | null;
  is_login?: number | string | null;
  is_admin?: boolean | number | null;
  created_at: string;
  updated_at: string;
}

export interface PoliticianUserDetails {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  user_id: number;
  politician_id: number;
  address?: string | null;
  party_name: string;
  party_logo?: string | null;
  party_banner?: string | null;
  dob?: string | null;
  age?: number | null;
  gender?: string | null;
  professions?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Politician {
  name: string;
  photoUrl?: string | null;
  image?: string | null;
  image_url?: string | null;
  party_name: string;
  party_logo?: string | null;
  party_logo_url?: string | null;
  party_banner?: string | null;
  party_banner_url?: string | null;
  gender?: string | null;
  age?: number | null;
  reference_no: string;
  user_type: string;
  userDetails?: PoliticianUserDetails | null;
}

export interface RegisterResponse {
  status: number;
  message: string;
  user: User;
  token: string;
  politician?: Politician | null;
}

export interface GetLoginUserResponse {
  status: number;
  message: string;
  login_users: User;
}

export interface GetBannerScreenResponse {
  status: number;
  message: string;
  politician: Politician;
}

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
  name: string;
  email: string;
  phone?: string;
  reference_no: string;
}

export type AuthFlowStep =
  | 'form'
  | 'consent'
  | 'processing'
  | 'verified_form'
  | 'success'
  | 'register_form'       // Primary registration form
  | 'party_splash'        // Party banner splash screen after successful registration
  | 'dashboard';          // Main user dashboard
