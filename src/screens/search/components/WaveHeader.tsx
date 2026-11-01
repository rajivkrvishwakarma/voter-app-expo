import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WAVE_SVG_HEIGHT = 70;

export interface WaveHeaderProps {
  totalCount: number;
  onBack: () => void;
}

export function WaveHeader({ totalCount, onBack }: WaveHeaderProps) {
  const insets = useSafeAreaInsets();
  const W = SCREEN_WIDTH;

  return (
    <View style={styles.container}>
      {/* Blue Top Background containing Safe Inset + Navigation Bar */}
      <View style={[styles.blueTopSection, { paddingTop: insets.top + 8 }]}>
        <View style={styles.navRow}>
          {/* White Circular Back Button */}
          <Pressable
            onPress={onBack}
            hitSlop={8}
            style={styles.backButton}
            accessibilityLabel="Go Back"
          >
            <Ionicons name="chevron-back" size={22} color="#0284C7" />
          </Pressable>

          {/* Center Title with Group Icon */}
          <View style={styles.titleRow}>
            <Ionicons name="people" size={20} color="#FFFFFF" style={styles.groupIcon} />
            <Text style={styles.titleText}>
              Total - {totalCount.toLocaleString()}, All
            </Text>
          </View>

          {/* Right Spacer for Center Balance */}
          <View style={styles.rightSpacer} />
        </View>
      </View>

      {/* Fluid Organic Multi-layered Wave Curve */}
      <Svg
        width={W}
        height={WAVE_SVG_HEIGHT}
        viewBox={`0 0 ${W} ${WAVE_SVG_HEIGHT}`}
        style={styles.waveSvg}
      >
        <Defs>
          <LinearGradient id="waveGradientPrimary" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#0284C7" />
            <Stop offset="50%" stopColor="#0369A1" />
            <Stop offset="100%" stopColor="#0EA5E9" />
          </LinearGradient>
          <LinearGradient id="waveGradientSecondary" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.3" />
          </LinearGradient>
        </Defs>

        {/* Background Soft Accent Wave */}
        <Path
          d={`M 0,0 L ${W},0 L ${W},38 C ${W * 0.82},68 ${W * 0.6},18 ${W * 0.38},56 C ${W * 0.2},74 ${W * 0.08},42 0,54 Z`}
          fill="url(#waveGradientSecondary)"
        />

        {/* Foreground Bold Vibrant Sky-Blue Wave */}
        <Path
          d={`M 0,0 L ${W},0 L ${W},20 C ${W * 0.8},65 ${W * 0.52},8 ${W * 0.3},46 C ${W * 0.16},60 ${W * 0.08},32 0,40 Z`}
          fill="url(#waveGradientPrimary)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  blueTopSection: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingBottom: 6,
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  groupIcon: {
    marginRight: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rightSpacer: {
    width: 38,
  },
  waveSvg: {
    marginTop: -1,
  },
});

