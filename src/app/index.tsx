import React, { useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer, Text, Button, Card, Input } from '@/components/ui';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { ThemeMode } from '@/theme';

export default function HomeScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useAppTheme();
  const [sampleInput, setSampleInput] = useState('');

  const themeModes: ThemeMode[] = ['system', 'light', 'dark'];

  return (
    <ScreenContainer scrollable>
      <View style={{ paddingVertical: theme.tokens.spacing.lg }}>
        {/* Header Section */}
        <View style={{ marginBottom: theme.tokens.spacing.xl }}>
          <Text variant="display" weight="bold">
            Voting App
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: 4 }}>
            Production-grade Expo foundation with NativeWind & centralized tokens.
          </Text>
        </View>

        {/* Theme Control Card */}
        <Card variant="bordered" style={{ marginBottom: theme.tokens.spacing.lg }}>
          <Text variant="subtitle" weight="bold">
            Theme Configuration
          </Text>
          <Text variant="caption" color="secondary" style={{ marginTop: 4, marginBottom: 12 }}>
            Active theme: {isDark ? 'Dark Mode' : 'Light Mode'} ({themeMode})
          </Text>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            {themeModes.map((mode) => (
              <Button
                key={mode}
                title={mode.charAt(0).toUpperCase() + mode.slice(1)}
                variant={themeMode === mode ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setThemeMode(mode)}
                style={{ flex: 1 }}
              />
            ))}
          </View>
        </Card>

        {/* Form Primitive Validation Card */}
        <Card variant="bordered" style={{ marginBottom: theme.tokens.spacing.lg }}>
          <Text variant="subtitle" weight="bold" style={{ marginBottom: 12 }}>
            Input & Action Validation
          </Text>

          <Input
            label="Sample Input"
            placeholder="Type here..."
            value={sampleInput}
            onChangeText={setSampleInput}
            hint="Validates accessibility labels and touch targets (min 44dp)."
            containerStyle={{ marginBottom: 12 }}
          />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              title="Primary Action"
              variant="primary"
              size="md"
              onPress={() => {}}
              style={{ flex: 1 }}
            />
            <Button
              title="Secondary"
              variant="secondary"
              size="md"
              onPress={() => {}}
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* System Status Card */}
        <Card variant="default" style={{ backgroundColor: theme.colors.background.surfaceSubtle }}>
          <Text variant="label" weight="semibold" color="brand">
            Architecture Ready
          </Text>
          <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
            API client, TanStack Query, Zustand, and design tokens are initialized.
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
