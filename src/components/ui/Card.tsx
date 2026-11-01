import React from 'react';
import { View, type ViewProps, type ViewStyle, type StyleProp } from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';

export type CardVariant = 'default' | 'elevated' | 'bordered';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function Card({
  variant = 'default',
  padding = 'md',
  style,
  children,
  className,
  ...rest
}: CardProps) {
  const { theme } = useAppTheme();

  const paddingValues = {
    none: 0,
    sm: theme.tokens.spacing.sm,
    md: theme.tokens.spacing.lg,
    lg: theme.tokens.spacing.xxl,
  }[padding];

  const variantStyles: ViewStyle = {
    default: {
      backgroundColor: theme.colors.background.surface,
      borderRadius: theme.tokens.radii.lg,
    },
    elevated: {
      backgroundColor: theme.colors.background.surfaceElevated,
      borderRadius: theme.tokens.radii.lg,
      ...theme.tokens.shadows.md,
    },
    bordered: {
      backgroundColor: theme.colors.background.surface,
      borderRadius: theme.tokens.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
  }[variant];

  return (
    <View
      className={className}
      style={[
        variantStyles,
        { padding: paddingValues },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
