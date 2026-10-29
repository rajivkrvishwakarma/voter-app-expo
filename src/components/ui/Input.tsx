import React, { useState, type ReactNode } from 'react';
import {
  View,
  TextInput,
  type TextInputProps,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  hint,
  error,
  leftElement,
  rightElement,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...textInputProps
}: InputProps) {
  const { theme } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  const getBorderColor = () => {
    if (hasError) return theme.colors.status.error.solid;
    if (isFocused) return theme.colors.border.focus;
    return theme.colors.border.default;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="label"
          weight="medium"
          style={[styles.label, { color: theme.colors.text.secondary }]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.background.surface,
            borderColor: getBorderColor(),
            borderRadius: theme.tokens.radii.md,
          },
        ]}
      >
        {leftElement && <View style={styles.accessoryLeft}>{leftElement}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              fontSize: theme.tokens.typography.sizes.base,
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

      {error ? (
        <Text
          variant="caption"
          style={[styles.feedback, { color: theme.colors.status.error.text }]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : hint ? (
        <Text
          variant="caption"
          style={[styles.feedback, { color: theme.colors.text.muted }]}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 44, // 44dp minimum touch target
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44,
    paddingVertical: 0,
  },
  accessoryLeft: {
    marginRight: 8,
  },
  accessoryRight: {
    marginLeft: 8,
  },
  feedback: {
    marginTop: 4,
  },
});
