/**
 * Central registry of voter survey color codes.
 *
 * Used for voter mobilization categorizations and survey updates.
 */

export interface VoterColorOption {
  key: string;
  name: string;
  hex: string;
}

export const VOTER_COLOR_CODES: VoterColorOption[] = [
  { key: 'green', name: 'Green', hex: '#008000' },
  { key: 'red', name: 'Red', hex: '#FF0000' },
  { key: 'yellow', name: 'Yellow', hex: '#FFFF00' },
  { key: 'white', name: 'White', hex: '#FFFFFF' },
  { key: 'chocolate', name: 'Chocolate', hex: '#D2691E' },
  { key: 'orange', name: 'Orange', hex: '#FFA500' },
  { key: 'blue', name: 'Blue', hex: '#0000FF' },
  { key: 'pink', name: 'Pink', hex: '#FFC0CB' },
  { key: 'violet', name: 'Violet', hex: '#EE82EE' },
  { key: 'others', name: 'Others', hex: '#FFFFFF' },
];

export const COLOR_CODE_MAP: Record<string, string> = {
  green: '#008000',
  red: '#FF0000',
  yellow: '#FFFF00',
  white: '#FFFFFF',
  chocolate: '#D2691E',
  orange: '#FFA500',
  blue: '#0000FF',
  pink: '#FFC0CB',
  violet: '#EE82EE',
  others: '#FFFFFF',
};

/**
 * Finds a matching color option given either a hex code or color name/key.
 */
export function findColorOption(input?: string | null): VoterColorOption {
  if (!input) return VOTER_COLOR_CODES[0];

  const lower = input.trim().toLowerCase();
  const matched = VOTER_COLOR_CODES.find(
    (c) => c.hex.toLowerCase() === lower || c.name.toLowerCase() === lower || c.key.toLowerCase() === lower
  );

  return matched || { key: 'custom', name: input, hex: input.startsWith('#') ? input : '#0284C7' };
}

