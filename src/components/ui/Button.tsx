import React, { type ReactNode } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  type ViewStyle,
  type StyleProp,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  onPress?: () => void;
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
  accessibilityLabel,
  onPress,
}: ButtonProps) {
  const { theme, isDark } = useAppTheme();
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { minHeight: 38, paddingHorizontal: 14, paddingVertical: 8, radius: theme.tokens.radii.md },
    md: { minHeight: 46, paddingHorizontal: 18, paddingVertical: 11, radius: theme.tokens.radii.lg },
    lg: { minHeight: 52, paddingHorizontal: 22, paddingVertical: 14, radius: theme.tokens.radii.lg },
  }[size];

  const primarySolid = isDark ? '#0EA5E9' : '#0284C7';
  const primaryText = '#FFFFFF';

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: theme.colors.background.surfaceSubtle,
          border: 'transparent',
          textColor: theme.colors.text.primary,
        };
      case 'outline':
        return {
          bg: 'transparent',
          border: theme.colors.border.default,
          textColor: theme.colors.text.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          border: 'transparent',
          textColor: theme.colors.brand.primary,
        };
      case 'destructive':
        return {
          bg: theme.colors.status.error.solid,
          border: 'transparent',
          textColor: theme.colors.text.inverse,
        };
      case 'primary':
      default:
        return {
          bg: primarySolid,
          border: 'transparent',
          textColor: primaryText,
        };
    }
  };

  const v = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          minHeight: sizeStyles.minHeight,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.radius,
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
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
              weight="bold"
              style={[styles.text, { color: v.textColor }]}
            >
              {title}
            </Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    letterSpacing: 0.3,
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
