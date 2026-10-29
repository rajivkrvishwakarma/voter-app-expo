import React, { type ReactNode } from 'react';
import {
  Pressable,
  ActivityIndicator,
  View,
  type PressableProps,
  type ViewStyle,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
  className?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  className,
  accessibilityLabel,
  ...pressableProps
}: ButtonProps) {
  const { theme } = useAppTheme();
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { minHeight: 36, paddingHorizontal: 12, paddingVertical: 6, radius: theme.tokens.radii.md },
    md: { minHeight: 44, paddingHorizontal: 16, paddingVertical: 10, radius: theme.tokens.radii.lg },
    lg: { minHeight: 52, paddingHorizontal: 20, paddingVertical: 14, radius: theme.tokens.radii.lg },
  }[size];

  const getVariantStyles = (pressed: boolean) => {
    switch (variant) {
      case 'secondary':
        return {
          bg: pressed ? theme.colors.border.default : theme.colors.background.surfaceSubtle,
          border: 'transparent',
          textColor: theme.colors.text.primary,
        };
      case 'outline':
        return {
          bg: pressed ? theme.colors.background.surfaceSubtle : 'transparent',
          border: theme.colors.border.default,
          textColor: theme.colors.text.primary,
        };
      case 'ghost':
        return {
          bg: pressed ? theme.colors.background.surfaceSubtle : 'transparent',
          border: 'transparent',
          textColor: theme.colors.brand.primary,
        };
      case 'destructive':
        return {
          bg: pressed ? theme.colors.status.error.solid : theme.colors.status.error.solid,
          border: 'transparent',
          textColor: theme.colors.text.inverse,
        };
      case 'primary':
      default:
        return {
          bg: pressed ? theme.colors.brand.primaryPressed : theme.colors.brand.primary,
          border: 'transparent',
          textColor: theme.colors.brand.onPrimary,
        };
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={className}
      style={({ pressed }) => {
        const v = getVariantStyles(pressed);
        return [
          styles.base,
          {
            minHeight: sizeStyles.minHeight,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            borderRadius: sizeStyles.radius,
            backgroundColor: v.bg,
            borderColor: v.border,
            borderWidth: variant === 'outline' ? 1 : 0,
            opacity: isDisabled ? 0.5 : 1,
          },
          style,
        ];
      }}
      {...pressableProps}
    >
      {({ pressed }) => {
        const v = getVariantStyles(pressed);
        return (
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={v.textColor}
                style={styles.spinner}
              />
            ) : (
              <>
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <Text
                  variant={size === 'sm' ? 'caption' : 'label'}
                  weight="semibold"
                  style={{ color: v.textColor }}
                >
                  {title}
                </Text>
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginVertical: 2,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
