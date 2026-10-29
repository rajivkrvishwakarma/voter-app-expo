import React from 'react';
import { View, ActivityIndicator, StyleSheet, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from '@/components/ui/Text';

export interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export function LoadingState({ message = 'Loading...', style }: LoadingStateProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={theme.colors.brand.primary} />
      {message ? (
        <Text
          variant="body"
          color="secondary"
          style={styles.message}
        >
          {message}
        </Text>
      ) : null}
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
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});
