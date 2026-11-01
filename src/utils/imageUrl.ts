import { ENV } from '@/constants/env';

/**
 * Resolves a full, absolute image URL from an API response path, safely encoding spaces and characters.
 */
export function resolveImageUrl(path?: string | null): string | null {
  if (!path) return null;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return encodeURI(path);
  }

  const cleanBase = ENV.apiBaseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return encodeURI(`${cleanBase}${cleanPath}`);
}
