import type { ViewStyle } from 'react-native';
import { palette, spacing, typography, radii, touchTargets, shadows } from './tokens';

export interface ThemeColors {
  background: {
    canvas: string;
    surface: string;
    surfaceElevated: string;
    surfaceSubtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    focus: string;
  };
  brand: {
    primary: string;
    primaryHover: string;
    primaryPressed: string;
    onPrimary: string;
    subtle: string;
  };
  status: {
    success: { bg: string; border: string; text: string; solid: string };
    warning: { bg: string; border: string; text: string; solid: string };
    error: { bg: string; border: string; text: string; solid: string };
    info: { bg: string; border: string; text: string; solid: string };
  };
}

export interface AppTheme {
  isDark: boolean;
  colors: ThemeColors;
  tokens: {
    spacing: typeof spacing;
    typography: typeof typography;
    radii: typeof radii;
    touchTargets: typeof touchTargets;
    shadows: Record<'none' | 'sm' | 'md' | 'lg', ViewStyle>;
  };
}

export const lightTheme: AppTheme = {
  isDark: false,
  colors: {
    background: {
      canvas: palette.slate[50],          // Crisp off-white canvas
      surface: palette.common.white,       // Pure white card surfaces
      surfaceElevated: palette.common.white,
      surfaceSubtle: palette.brand[50],    // Subtle sky blue tint
    },
    text: {
      primary: palette.slate[900],        // Authoritative, bold dark slate
      secondary: palette.slate[600],
      tertiary: palette.slate[500],
      muted: palette.slate[400],
      inverse: palette.common.white,
    },
    border: {
      subtle: palette.slate[100],
      default: palette.slate[200],
      strong: palette.slate[300],
      focus: palette.brand[500],          // Sky Blue focus ring
    },
    brand: {
      primary: palette.brand[600],        // Vibrant Sky / Royal Blue (#0284C7)
      primaryHover: palette.brand[700],
      primaryPressed: palette.brand[800],
      onPrimary: palette.common.white,
      subtle: palette.brand[100],         // Light sky blue pill / badge
    },
    status: {
      success: {
        bg: palette.success[50],
        border: palette.success[100],
        text: palette.success[700],
        solid: palette.success[600],
      },
      warning: {
        bg: palette.warning[50],
        border: palette.warning[100],
        text: palette.warning[700],
        solid: palette.warning[600],
      },
      error: {
        bg: palette.error[50],
        border: palette.error[100],
        text: palette.error[700],
        solid: palette.error[600],
      },
      info: {
        bg: palette.brand[50],
        border: palette.brand[100],
        text: palette.brand[700],
        solid: palette.brand[600],
      },
    },
  },
  tokens: {
    spacing,
    typography,
    radii,
    touchTargets,
    shadows,
  },
};
