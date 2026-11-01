import React, { type ReactNode, type ReactElement } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
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
  edges = ['top', 'left', 'right', 'bottom'],
  style,
  contentContainerStyle,
  className,
}: ScreenContainerProps) {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const containerPadding: ViewStyle = contentPadding
    ? { paddingHorizontal: theme.tokens.spacing.lg }
    : {};

  // Compute safe padding synchronously to prevent asynchronous layout jerks on screen mount
  const safePadding: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View
      className={className}
      style={[
        styles.safeArea,
        safePadding,
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
    </View>
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
    paddingBottom: 24,
  },
  staticContent: {
    flex: 1,
  },
});
