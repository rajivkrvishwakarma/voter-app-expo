import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: ReactNode;
  style?: ViewStyle;
}

export function EmptyState({
  title = 'No items found',
  description = 'There is currently no data to display.',
  actionTitle,
  onAction,
  icon,
  style,
}: EmptyStateProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <View
          style={[
            styles.placeholderCircle,
            { backgroundColor: theme.colors.background.surfaceSubtle },
          ]}
        >
          <Text variant="title" color="muted">
            —
          </Text>
        </View>
      )}

      <Text variant="subtitle" weight="bold" align="center" style={styles.title}>
        {title}
      </Text>

      <Text variant="body" color="secondary" align="center" style={styles.description}>
        {description}
      </Text>

      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="outline"
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
  iconContainer: {
    marginBottom: 16,
  },
  placeholderCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    maxWidth: 280,
    marginBottom: 20,
  },
  button: {
    minWidth: 140,
  },
});
