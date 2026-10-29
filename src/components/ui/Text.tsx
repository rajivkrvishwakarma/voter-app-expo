import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';

export type TextVariant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand' | 'error' | 'success';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
  className?: string;
}

export function Text({
  variant = 'body',
  color = 'primary',
  weight,
  align = 'left',
  style,
  children,
  className,
  ...rest
}: TextProps) {
  const { theme } = useAppTheme();

  const colorStyles: Record<TextColor, string> = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    muted: theme.colors.text.muted,
    inverse: theme.colors.text.inverse,
    brand: theme.colors.brand.primary,
    error: theme.colors.status.error.text,
    success: theme.colors.status.success.text,
  };

  const variantStyles = {
    display: {
      fontSize: theme.tokens.typography.sizes.display,
      lineHeight: theme.tokens.typography.lineHeights.display,
      fontWeight: theme.tokens.typography.weights.bold,
    },
    title: {
      fontSize: theme.tokens.typography.sizes.xxl,
      lineHeight: theme.tokens.typography.lineHeights.xxl,
      fontWeight: theme.tokens.typography.weights.bold,
    },
    subtitle: {
      fontSize: theme.tokens.typography.sizes.lg,
      lineHeight: theme.tokens.typography.lineHeights.lg,
      fontWeight: theme.tokens.typography.weights.semibold,
    },
    body: {
      fontSize: theme.tokens.typography.sizes.base,
      lineHeight: theme.tokens.typography.lineHeights.base,
      fontWeight: theme.tokens.typography.weights.regular,
    },
    caption: {
      fontSize: theme.tokens.typography.sizes.xs,
      lineHeight: theme.tokens.typography.lineHeights.xs,
      fontWeight: theme.tokens.typography.weights.regular,
    },
    label: {
      fontSize: theme.tokens.typography.sizes.sm,
      lineHeight: theme.tokens.typography.lineHeights.sm,
      fontWeight: theme.tokens.typography.weights.medium,
    },
  }[variant];

  const resolvedWeight = weight
    ? theme.tokens.typography.weights[weight]
    : variantStyles.fontWeight;

  return (
    <RNText
      className={className}
      style={[
        {
          color: colorStyles[color],
          fontSize: variantStyles.fontSize,
          lineHeight: variantStyles.lineHeight,
          fontWeight: resolvedWeight,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
