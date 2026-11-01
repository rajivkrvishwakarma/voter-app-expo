import React, { useState, type ReactNode } from 'react';
import {
  View,
  TextInput,
  type TextInputProps,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  labelBadge?: ReactNode;
  helperRight?: ReactNode;
  hint?: string;
  error?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerStyle?: ViewStyle;
  inputWrapperStyle?: ViewStyle;
}

export function Input({
  label,
  required,
  labelBadge,
  helperRight,
  hint,
  error,
  leftElement,
  rightElement,
  containerStyle,
  inputWrapperStyle,
  style,
  onFocus,
  onBlur,
  ...textInputProps
}: InputProps) {
  const { theme, isDark } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const inputBg = isDark ? '#101C38' : '#F1F5FD';

  const getBorderColor = () => {
    if (hasError) return theme.colors.status.error.solid;
    if (isFocused) return theme.colors.brand.primary;
    return isDark ? '#1E356A' : 'transparent';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label & Top Helper Row */}
      {(label || helperRight || labelBadge) && (
        <View style={styles.labelRow}>
          <View style={styles.labelLeftContainer}>
            {label && (
              <Text variant="label" weight="bold" style={styles.labelText}>
                {label}
                {required && (
                  <Text variant="label" style={styles.requiredAsterisk}>
                    {' '}*
                  </Text>
                )}
              </Text>
            )}
            {labelBadge && <View style={styles.badgeWrapper}>{labelBadge}</View>}
          </View>

          {typeof helperRight === 'string' ? (
            <Text variant="caption" color="secondary" style={styles.helperRightText}>
              {helperRight}
            </Text>
          ) : (
            helperRight
          )}
        </View>
      )}

      {/* Input Box Wrapper */}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: inputBg,
            borderColor: getBorderColor(),
          },
          inputWrapperStyle,
        ]}
      >
        {leftElement && <View style={styles.accessoryLeft}>{leftElement}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          accessibilityLabel={label || textInputProps.placeholder}
          accessibilityHint={hint}
          aria-invalid={hasError}
          {...textInputProps}
        />

        {rightElement && <View style={styles.accessoryRight}>{rightElement}</View>}
      </View>

      {/* Error Feedback */}
      {error && (
        <Text
          variant="caption"
          style={styles.errorText}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}

      {/* Hint Note with Info Icon */}
      {!error && hint && (
        <View style={styles.hintRow}>
          <Ionicons name="information-circle-outline" size={14} color="#64748B" />
          <Text variant="caption" color="secondary" style={styles.hintText}>
            {hint}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  labelLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  badgeWrapper: {
    marginLeft: 6,
  },
  helperRightText: {
    fontSize: 11,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    paddingVertical: 0,
  },
  accessoryLeft: {
    marginRight: 10,
  },
  accessoryRight: {
    marginLeft: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  hintText: {
    fontSize: 11,
    marginLeft: 5,
    flex: 1,
    lineHeight: 15,
  },
});
