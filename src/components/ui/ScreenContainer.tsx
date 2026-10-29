import React, { type ReactNode, type ReactElement } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useAppTheme } from '@/providers/ThemeProvider';

export interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  refreshControl?: ReactElement;
  contentPadding?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  className?: string;
}

export function ScreenContainer({
  children,
  scrollable = false,
  refreshControl,
  contentPadding = true,
  edges = ['top', 'left', 'right'],
  style,
  contentContainerStyle,
  className,
}: ScreenContainerProps) {
  const { theme, isDark } = useAppTheme();

  const containerPadding: ViewStyle = contentPadding
    ? { paddingHorizontal: theme.tokens.spacing.lg }
    : {};

  return (
    <SafeAreaView
      edges={edges}
      className={className}
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background.canvas },
        style,
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            containerPadding,
            contentContainerStyle,
          ]}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.staticContent, containerPadding, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
});
