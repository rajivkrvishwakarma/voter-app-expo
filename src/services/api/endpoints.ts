/**
 * Central API Endpoint Registry.
 *
 * Rules (from AGENTS.md):
 * - Keep all endpoint paths in this central registry; do NOT scatter raw endpoint strings throughout screens or hooks.
 * - Group paths by domain.
 * - Dynamic path segments MUST be encoded safely using encodeURIComponent or helper functions.
 * - Keep base URLs separate in environment configuration (ENV.apiBaseUrl).
 * - Only register verified endpoints. Do not invent speculative production endpoints.
 */

export const API_ENDPOINTS = {
  // System / Health endpoints
  system: {
    health: '/health',
  },
  // Authentication & Credential verification endpoints
  auth: {
    register: '/api/register',
    logout: '/api/logout',
    verifyEmailCredential: '/api/auth/verify-email-credential',
  },
  // User profile endpoints
  user: {
    me: '/api/user',
  },
  // Politician & Campaign endpoints
  campaign: {
    bannerScreen: '/api/banner-screen',
  },
  // Voter management endpoints
  voters: {
    allVoters: '/api/all-voter-list',
    searchByName: '/api/search-by-name',
  },
  // Localization & Language endpoints
  localization: {
    languages: '/api/languages',
    changeLanguage: '/api/change-language',
  },
} as const;

/**
 * Type-safe path helper to ensure path parameters are encoded safely.
 */
export function buildPath(template: string, params: Record<string, string | number>): string {
  let path = template;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(String(value)));
  }
  return path;
}
