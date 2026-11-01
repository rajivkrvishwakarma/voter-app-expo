import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce any fast-changing value.
 * Commonly used for search input fields to prevent excessive API requests.
 *
 * @param value The value to debounce.
 * @param delay Milliseconds delay before updating the debounced value (default: 400ms).
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

