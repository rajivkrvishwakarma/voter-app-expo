import React from 'react';
import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/providers/ThemeProvider';

export interface GoogleEmailButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GoogleEmailButton({ onPress, loading = false, disabled = false }: GoogleEmailButtonProps) {
  const { theme } = useAppTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue with Google Email"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? '#1d4ed8' : '#2563eb', // Royal blue per design
          borderRadius: theme.tokens.radii.lg,
          opacity: isDisabled ? 0.6 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <View style={styles.content}>
          {/* Email / Google icon emblem */}
          <View style={styles.iconContainer}>
            <View style={styles.mailEnvelope}>
              <Text style={styles.mailSymbol}>✉</Text>
            </View>
          </View>
          <Text variant="label" weight="semibold" style={styles.buttonText}>
            Continue with Google Email
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mailEnvelope: {
    width: 22,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mailSymbol: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
  },
});
