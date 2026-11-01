/**
 * Core design tokens: Primitive color palette, spacing, typography scale, radii, and elevations.
 *
 * App Theme Standard (Strictly enforced):
 * - Light Mode: Clean White canvas & surfaces with vibrant Sky Blue (#0284C7 / #0EA5E9) primary accents.
 * - Dark Mode: Deep Midnight / Navy Dark Blue (#070D1E / #0D1935 / #132347) with electric Sky Blue accents.
 * - Style: Bold, crisp, executive-grade mobile application design (no toy/childish aesthetics).
 */

export const palette = {
  // Vibrant Sky Blue / Electric Campaign Blue (Matching official banner)
  brand: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Sky Blue
    600: '#0284C7', // Primary Sky / Royal Blue
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },

  // Deep Navy / Midnight Dark Blue (For executive Dark Mode)
  navy: {
    950: '#050A18', // Deepest background
    900: '#070D1E', // Canvas
    850: '#0A1329',
    800: '#0D1935', // Surface Card
    750: '#101F40',
    700: '#132347', // Elevated Surface
    600: '#1A3060', // Border Subtle
    500: '#1E356A', // Border Default
    400: '#2A478C', // Border Strong
    300: '#3D61B0',
    200: '#688CD4',
    100: '#A4BFEF',
  },

  // Neutrals (Slate for Light Mode)
  slate: {
    25: '#FCFCFD',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Feedback states
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
  },
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
} as const;

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

export const typography = {
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 19,
    xxl: 22,
    xxxl: 28,
    display: 34,
  },
  lineHeights: {
    xs: 15,
    sm: 18,
    base: 22,
    lg: 24,
    xl: 26,
    xxl: 28,
    xxxl: 34,
    display: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
} as const;

export const touchTargets = {
  minTouchSize: 44, // 44dp per accessibility standard
} as const;

export const shadows = {
  none: {
    shadowColor: palette.common.transparent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: palette.slate[950],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: palette.slate[950],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: palette.slate[950],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
