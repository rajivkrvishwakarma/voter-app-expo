import { useAppTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { type ReactElement, type ReactNode } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Text } from './Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WAVE_SVG_HEIGHT = 80;

export interface WaveScreenContainerProps {
  children: ReactNode;
  title?: string | ReactNode;
  onBack?: () => void;
  rightElement?: ReactNode;
  headerCenter?: ReactNode;
  scrollable?: boolean;
  refreshControl?: ReactElement;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
}

/**
 * Reusable screen layout featuring an organic, multi-layered Sky Blue wavy header,
 * safe-area handling without layout jump, and customizable back action & children.
 */
export function WaveScreenContainer({
  children,
  title,
  onBack,
  rightElement,
  headerCenter,
  scrollable = false,
  refreshControl,
  contentContainerStyle,
  style,
}: WaveScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { isDark, theme } = useAppTheme();

  const screenBg = isDark ? '#070D1E' : theme.colors.background.canvas;

  // Bezier parameters for dynamic multi-layered wave curves
  const W = SCREEN_WIDTH;

  return (
    <View style={[styles.container, { backgroundColor: screenBg }, style]}>
      <StatusBar style="light" />

      {/* 1. Sky Blue Top Section with Navigation Bar */}
      <View style={[styles.topSection, { paddingTop: insets.top + 8 }]}>
        {/* Decorative ambient wave ribbon in top right */}
        <Svg
          style={StyleSheet.absoluteFill}
          width={W}
          height={insets.top + 64}
          viewBox={`0 0 ${W} ${insets.top + 64}`}
          pointerEvents="none"
        >
          <Path
            d={`M ${W * 0.45},0 C ${W * 0.62},${insets.top + 18} ${W * 0.82},${insets.top + 42} ${W},${insets.top + 18} L ${W},0 Z`}
            fill="#38BDF8"
            opacity={0.35}
          />
        </Svg>

        <View style={styles.navRow}>
          {/* Left: White Circular Back Button */}
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={8}
              style={styles.backButton}
              accessibilityLabel="Go Back"
            >
              <Ionicons name="chevron-back" size={22} color="#0284C7" />
            </Pressable>
          ) : (
            <View style={styles.sideSpacer} />
          )}

          {/* Center Title or Custom Center Element */}
          <View style={styles.centerContainer}>
            {headerCenter ? (
              headerCenter
            ) : typeof title === 'string' ? (
              <Text style={styles.defaultTitleText} numberOfLines={1}>
                {title}
              </Text>
            ) : (
              title
            )}
          </View>

          {/* Right Action or Balancing Spacer */}
          {rightElement ? (
            <View style={styles.rightWrapper}>{rightElement}</View>
          ) : (
            <View style={styles.sideSpacer} />
          )}
        </View>
      </View>

      {/* 2. Fluid Organic Multi-layered SVG Wave Curve */}
      <View style={styles.waveWrapper}>
        <Svg
          width={W}
          height={WAVE_SVG_HEIGHT}
          viewBox={`0 0 ${W} ${WAVE_SVG_HEIGHT}`}
          style={styles.waveSvg}
        >
          <Defs>
            <LinearGradient id="waveGradPrimary" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#0284C7" />
              <Stop offset="55%" stopColor="#0369A1" />
              <Stop offset="100%" stopColor="#0284C7" />
            </LinearGradient>
            <LinearGradient id="waveGradSecondary" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.2" />
            </LinearGradient>
          </Defs>

          {/* Background Soft Wave Ribbon (sweeps from mid down to bottom right) */}
          {/* Background Soft Wave Ribbon */}
          <Path
            d={`M 0,0 L ${W},0 L ${W},24 C ${W * 0.82},39 ${W * 0.64},12 ${W * 0.42},31 C ${W * 0.22},41 ${W * 0.08},23 0,29 Z`}
            fill="url(#waveGradSecondary)"
          />

          {/* Foreground Bold Sky-Blue Wave */}
          <Path
            d={`M 0,0 L ${W},0 L ${W},14 C ${W * 0.82},6 ${W * 0.62},28 ${W * 0.38},27 C ${W * 0.2},26 ${W * 0.08},11 0,17 Z`}
            fill="url(#waveGradPrimary)"
          />
        </Svg>
      </View>

      {/* 3. Screen Body Content */}
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.staticContent, contentContainerStyle]}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  sideSpacer: {
    width: 38,
    height: 38,
  },
  rightWrapper: {
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  defaultTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  waveWrapper: {
    width: '100%',
    zIndex: 1,
  },
  waveSvg: {
    marginTop: -1,
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
