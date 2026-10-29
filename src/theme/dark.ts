import { palette, spacing, typography, radii, touchTargets, shadows } from './tokens';
import type { AppTheme } from './light';

export const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    background: {
      canvas: palette.slate[950],
      surface: palette.slate[900],
      surfaceElevated: palette.slate[800],
      surfaceSubtle: palette.slate[800],
    },
    text: {
      primary: palette.slate[50],
      secondary: palette.slate[300],
      tertiary: palette.slate[400],
      muted: palette.slate[500],
      inverse: palette.slate[900],
    },
    border: {
      subtle: palette.slate[800],
      default: palette.slate[700],
      strong: palette.slate[600],
      focus: palette.brand[400],
    },
    brand: {
      primary: palette.brand[500],
      primaryHover: palette.brand[400],
      primaryPressed: palette.brand[600],
      onPrimary: palette.common.white,
      subtle: palette.slate[800],
    },
    status: {
      success: {
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.3)',
        text: '#34d399',
        solid: palette.success[500],
      },
      warning: {
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.3)',
        text: '#fbbf24',
        solid: palette.warning[500],
      },
      error: {
        bg: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.3)',
        text: '#f87171',
        solid: palette.error[500],
      },
      info: {
        bg: 'rgba(14, 165, 233, 0.15)',
        border: 'rgba(14, 165, 233, 0.3)',
        text: '#38bdf8',
        solid: palette.info[500],
      },
    },
  },
  tokens: {
    spacing,
    typography,
    radii,
    touchTargets,
    shadows: {
      none: shadows.none,
      sm: {
        ...shadows.sm,
        shadowColor: palette.common.black,
        shadowOpacity: 0.3,
      },
      md: {
        ...shadows.md,
        shadowColor: palette.common.black,
        shadowOpacity: 0.4,
      },
      lg: {
        ...shadows.lg,
        shadowColor: palette.common.black,
        shadowOpacity: 0.5,
      },
    },
  },
};
