import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text } from './Text';

export interface ModalWrapperProps {
  /** Whether the modal is displayed */
  visible: boolean;
  /** Callback fired when the modal requests dismissal */
  onClose: () => void;
  /** Modal presentation layout: 'bottom-sheet' (slide up from bottom) or 'center' (pop in middle) */
  type?: 'bottom-sheet' | 'center';
  /** Modal header title */
  title?: string;
  /** Modal header subtitle */
  subtitle?: string;
  /** Whether to show the top-right close icon button */
  showCloseButton?: boolean;
  /** Modal content */
  children: React.ReactNode;
  /** Content container custom styling */
  contentStyle?: StyleProp<ViewStyle>;
  /** Whether clicking the dimmed backdrop closes the modal */
  closeOnBackdropPress?: boolean;
  /** Maximum height constraint (e.g. '85%') */
  maxHeight?: number | string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ModalWrapper({
  visible,
  onClose,
  type = 'bottom-sheet',
  title,
  subtitle,
  showCloseButton = true,
  children,
  contentStyle,
  closeOnBackdropPress = true,
  maxHeight = '85%',
}: ModalWrapperProps) {
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Animated values conforming to React 19 compiler rules
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetTranslateY] = useState(() => new Animated.Value(SCREEN_HEIGHT));
  const [centerScale] = useState(() => new Animated.Value(0.92));
  const [centerOpacity] = useState(() => new Animated.Value(0));

  const handleShow = () => {
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(SCREEN_HEIGHT);
    centerScale.setValue(0.92);
    centerOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      type === 'bottom-sheet'
        ? Animated.spring(sheetTranslateY, {
            toValue: 0,
            damping: 24,
            stiffness: 260,
            mass: 0.9,
            useNativeDriver: true,
          })
        : Animated.parallel([
            Animated.spring(centerScale, {
              toValue: 1,
              damping: 20,
              stiffness: 240,
              useNativeDriver: true,
            }),
            Animated.timing(centerOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
    ]).start();
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      type === 'bottom-sheet'
        ? Animated.timing(sheetTranslateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          })
        : Animated.parallel([
            Animated.timing(centerScale, {
              toValue: 0.92,
              duration: 160,
              useNativeDriver: true,
            }),
            Animated.timing(centerOpacity, {
              toValue: 0,
              duration: 160,
              useNativeDriver: true,
            }),
          ]),
    ]).start(() => {
      onClose();
    });
  };

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#E2E8F0';
  const handleColor = isDark ? '#334155' : '#CBD5E1';
  const closeBtnBg = isDark ? '#132347' : '#F1F5F9';
  const closeIconColor = isDark ? '#94A3B8' : '#64748B';

  const isBottomSheet = type === 'bottom-sheet';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onShow={handleShow}
      onRequestClose={handleDismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View
          style={[
            styles.overlayContainer,
            isBottomSheet ? styles.overlayBottom : styles.overlayCenter,
          ]}
        >
          {/* Dimmed Animated Backdrop */}
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.55],
                }),
              },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeOnBackdropPress ? handleDismiss : undefined}
              accessibilityLabel="Dismiss modal"
            />
          </Animated.View>

          {/* Modal Container Card */}
          <Animated.View
            style={[
              isBottomSheet ? styles.bottomSheetCard : styles.centerCard,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
                maxHeight,
                paddingBottom: isBottomSheet ? Math.max(insets.bottom, 16) : 20,
                transform: isBottomSheet
                  ? [{ translateY: sheetTranslateY }]
                  : [{ scale: centerScale }],
                opacity: isBottomSheet ? 1 : centerOpacity,
              },
              contentStyle,
            ]}
          >
            {/* Drag Handle Bar for Bottom Sheet */}
            {isBottomSheet && (
              <View style={styles.handleContainer}>
                <View style={[styles.handleBar, { backgroundColor: handleColor }]} />
              </View>
            )}

            {/* Modal Header */}
            {(title || showCloseButton) && (
              <View style={styles.headerRow}>
                <View style={styles.headerTextCol}>
                  {title ? (
                    <Text variant="subtitle" weight="bold">
                      {title}
                    </Text>
                  ) : null}
                  {subtitle ? (
                    <Text variant="caption" color="secondary" style={styles.subtitle}>
                      {subtitle}
                    </Text>
                  ) : null}
                </View>

                {showCloseButton ? (
                  <TouchableOpacity
                    onPress={handleDismiss}
                    style={[styles.closeButton, { backgroundColor: closeBtnBg }]}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                  >
                    <Ionicons name="close" size={18} color={closeIconColor} />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {/* Modal Body */}
            {children}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    position: 'relative',
  },
  overlayBottom: {
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  bottomSheetCard: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 10,
  },
  centerCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 4,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
    marginBottom: 12,
  },
  headerTextCol: {
    flex: 1,
    marginRight: 12,
  },
  subtitle: {
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
