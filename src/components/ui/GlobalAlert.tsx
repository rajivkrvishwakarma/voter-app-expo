import React, { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useAlertStore, type AlertType } from '@/store/alert.store';
import { Text } from './Text';

export function GlobalAlert() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { visible, title, message, type, duration, actionText, onAction, hideAlert } =
    useAlertStore();

  const [translateY] = useState(() => new Animated.Value(-120));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (visible) {
      // Slide down and fade in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: insets.top + 8,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        timer = setTimeout(() => {
          hideAlert();
        }, duration);
      }
    } else {
      // Slide up and fade out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, duration, insets.top, translateY, opacity, hideAlert]);

  if (!visible) return null;

  const bgCard = isDark ? '#0D1935' : '#FFFFFF';
  const borderCard = isDark ? '#1E356A' : '#E2E8F0';

  const typeConfig: Record<
    AlertType,
    { icon: keyof typeof Ionicons.glyphMap; color: string; bgBadge: string }
  > = {
    success: {
      icon: 'checkmark-circle',
      color: '#22C55E',
      bgBadge: isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7',
    },
    error: {
      icon: 'alert-circle',
      color: '#EF4444',
      bgBadge: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
    },
    warning: {
      icon: 'warning',
      color: '#F59E0B',
      bgBadge: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
    },
    info: {
      icon: 'information-circle',
      color: '#0284C7',
      bgBadge: isDark ? 'rgba(2, 132, 199, 0.15)' : '#E0F2FE',
    },
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.overlay,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.alertCard,
          {
            backgroundColor: bgCard,
            borderColor: borderCard,
          },
        ]}
      >
        {/* Compact Status Icon Badge */}
        <View style={[styles.iconBadge, { backgroundColor: current.bgBadge }]}>
          <Ionicons name={current.icon} size={15} color={current.color} />
        </View>

        {/* Content Column */}
        <View style={styles.textContainer}>
          <View style={styles.inlineContent}>
            <Text variant="caption" weight="bold" numberOfLines={1}>
              {title}
            </Text>
            {message ? (
              <Text variant="caption" color="secondary" numberOfLines={1} style={styles.messageText}>
                {` • ${message}`}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Optional Action Button */}
        {actionText && onAction ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onAction();
              hideAlert();
            }}
            style={styles.actionBtn}
          >
            <Text variant="caption" weight="bold" style={{ color: current.color, fontSize: 11 }}>
              {actionText}
            </Text>
          </TouchableOpacity>
        ) : null}

        {/* Dismiss Button */}
        <Pressable onPress={hideAlert} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={15} color={isDark ? '#94A3B8' : '#64748B'} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  alertCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  messageText: {
    flexShrink: 1,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 4,
  },
});
