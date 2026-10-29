import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/providers/ThemeProvider';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export interface VerifyingOverlayProps {
  email?: string;
}

export function VerifyingOverlay({ email }: VerifyingOverlayProps) {
  const { theme, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.canvas },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Verifying your email"
    >
      <View style={styles.centerContent}>
        {/* Animated Loading Ring */}
        <View
          style={[
            styles.spinnerRing,
            {
              backgroundColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
              borderColor: isDark ? '#1e3a8a' : '#dbeafe',
            },
          ]}
        >
          <ActivityIndicator size="large" color="#2563eb" />
        </View>

        <Text variant="title" weight="bold" align="center" style={styles.title}>
          Verifying your email...
        </Text>

        <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
          Please wait while we securely verify your Google email.
        </Text>

        {email ? (
          <View
            style={[
              styles.pill,
              { backgroundColor: theme.colors.background.surfaceSubtle },
            ]}
          >
            <Text variant="caption" color="secondary">
              {email}
            </Text>
          </View>
        ) : null}
      </View>
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 320,
  },
  spinnerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
    textAlign: 'center',
  },
  pill: {
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
