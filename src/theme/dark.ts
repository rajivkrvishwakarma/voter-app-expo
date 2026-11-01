import { palette, spacing, typography, radii, touchTargets, shadows } from './tokens';
import type { AppTheme } from './light';

export const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    background: {
      canvas: palette.navy[900],          // Deep Executive Navy Blue (#070D1E)
      surface: palette.navy[800],         // Dark Blue Card Surface (#0D1935)
      surfaceElevated: palette.navy[700], // Elevated Dark Blue Surface (#132347)
      surfaceSubtle: palette.navy[750],   // Subtle Dark Blue (#101F40)
    },
    text: {
      primary: palette.common.white,      // Pure crisp white text for high contrast
      secondary: palette.navy[100],       // Soft ice blue secondary text (#A4BFEF)
      tertiary: palette.slate[400],
      muted: palette.navy[300],
      inverse: palette.navy[950],
    },
    border: {
      subtle: palette.navy[600],          // Subtle dark navy border (#1A3060)
      default: palette.navy[500],         // Default navy border (#1E356A)
      strong: palette.navy[400],          // Pronounced navy border (#2A478C)
      focus: palette.brand[400],          // Electric Sky Blue focus (#38BDF8)
    },
    brand: {
      primary: palette.brand[500],        // Vivid Electric Sky Blue (#0EA5E9)
      primaryHover: palette.brand[400],   // Bright Sky (#38BDF8)
      primaryPressed: palette.brand[600], // Deeper Sky (#0284C7)
      onPrimary: palette.common.white,
      subtle: palette.navy[700],          // Dark blue badge background (#132347)
    },
    status: {
      success: {
        bg: 'rgba(16, 185, 129, 0.16)',
        border: 'rgba(16, 185, 129, 0.35)',
        text: '#34D399',
        solid: palette.success[500],
      },
      warning: {
        bg: 'rgba(245, 158, 11, 0.16)',
        border: 'rgba(245, 158, 11, 0.35)',
        text: '#FBBF24',
        solid: palette.warning[500],
      },
      error: {
        bg: 'rgba(239, 68, 68, 0.16)',
        border: 'rgba(239, 68, 68, 0.35)',
        text: '#F87171',
        solid: palette.error[500],
      },
      info: {
        bg: 'rgba(14, 165, 233, 0.18)',
        border: 'rgba(14, 165, 233, 0.38)',
        text: '#38BDF8',
        solid: palette.brand[500],
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
        shadowColor: palette.navy[950],
        shadowOpacity: 0.35,
      },
      md: {
        ...shadows.md,
        shadowColor: palette.navy[950],
        shadowOpacity: 0.5,
      },
      lg: {
        ...shadows.lg,
        shadowColor: palette.navy[950],
        shadowOpacity: 0.65,
      },
    },
  },
};
