import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this content.',
  onRetry,
  retryLabel = 'Try Again',
  style,
}: ErrorStateProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <View
        style={[
          styles.badge,
          { backgroundColor: theme.colors.status.error.bg, borderColor: theme.colors.status.error.border },
        ]}
      >
        <Text variant="label" weight="bold" color="error">
          !
        </Text>
      </View>

      <Text variant="title" weight="bold" align="center" style={styles.title}>
        {title}
      </Text>

      <Text variant="body" color="secondary" align="center" style={styles.message}>
        {message}
      </Text>

      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    maxWidth: 320,
    marginBottom: 20,
  },
  button: {
    minWidth: 140,
  },
});
