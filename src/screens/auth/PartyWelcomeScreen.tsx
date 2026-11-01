import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@/components/ui';
import { resolveImageUrl } from '@/utils/imageUrl';
import type { Politician } from '@/features/auth/types/auth.types';

export interface PartyWelcomeScreenProps {
  politician?: Politician | null;
  onContinue: () => void;
}

export function PartyWelcomeScreen({
  politician,
  onContinue,
}: PartyWelcomeScreenProps) {
  const bannerUri = resolveImageUrl(
    politician?.party_banner_url || politician?.party_banner
  );
  const logoUri = resolveImageUrl(
    politician?.party_logo_url || politician?.party_logo
  );
  const partyName = politician?.party_name || 'CAMPAIGN PARTY';

  // Automatically redirect to dashboard after exactly 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* 1. Party Banner in Full Display */}
      {bannerUri ? (
        <Image
          source={{ uri: bannerUri }}
          style={styles.fullBanner}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.fallbackBackground} />
      )}

      {/* Subtle Bottom Gradient Shade for Text Contrast */}
      <View style={styles.bottomOverlay} />

      {/* 2. At Bottom: Party Logo and Party Name */}
      <View style={styles.bottomBar}>
        {logoUri && (
          <Image
            source={{ uri: logoUri }}
            style={styles.partyLogo}
            resizeMode="contain"
          />
        )}
        <Text variant="title" weight="bold" style={styles.partyNameText}>
          {partyName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D1E',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  fullBanner: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  fallbackBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0EA5E9',
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 44,
    zIndex: 10,
  },
  partyLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  partyNameText: {
    color: '#FFFFFF',
    fontSize: 24,
    letterSpacing: 0.8,
  },
});
