import React from 'react';
import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={20} color="#ffffff" />
          </View>
          <Text
            variant="label"
            weight="bold"
            color="inverse"
            style={styles.buttonText}
          >
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
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
