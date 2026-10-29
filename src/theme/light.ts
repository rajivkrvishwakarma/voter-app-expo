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
      canvas: palette.slate[50],
      surface: palette.common.white,
      surfaceElevated: palette.common.white,
      surfaceSubtle: palette.slate[100],
    },
    text: {
      primary: palette.slate[900],
      secondary: palette.slate[600],
      tertiary: palette.slate[400],
      muted: palette.slate[400],
      inverse: palette.common.white,
    },
    border: {
      subtle: palette.slate[100],
      default: palette.slate[200],
      strong: palette.slate[300],
      focus: palette.brand[500],
    },
    brand: {
      primary: palette.brand[600],
      primaryHover: palette.brand[700],
      primaryPressed: palette.brand[800],
      onPrimary: palette.common.white,
      subtle: palette.brand[50],
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
        bg: palette.info[50],
        border: palette.info[100],
        text: palette.info[700],
        solid: palette.info[600],
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
