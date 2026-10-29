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
    verifyEmailCredential: '/auth/verify-email-credential',
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
