import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { RegisterScreen, PartyWelcomeScreen } from '@/screens/auth';
import { DashboardScreen } from '@/screens/home';
import { ProfileScreen } from '@/screens/profile';
import { SearchScreen } from '@/screens/search';
import { useAuthStore } from '@/store/auth.store';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { RegisterResponse } from '@/features/auth/types/auth.types';

type ActiveScreen = 'dashboard' | 'profile' | 'search';

export default function IndexRoute() {
  const { theme } = useAppTheme();
  const { isAuthenticated, isLoadingSession, initializeSession, politician } = useAuthStore();
  const [showSplash, setShowSplash] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [latestRegistration, setLatestRegistration] = useState<RegisterResponse | null>(null);

  // Smooth transition animated values (initialized via useState to adhere to React 19 ref rules)
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [slideAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const navigateTo = (screen: ActiveScreen) => {
    if (screen === activeScreen) return;

    const isForward = screen !== 'dashboard';
    // Position starting offset for smooth native slide & fade
    slideAnim.setValue(isForward ? 20 : -20);
    fadeAnim.setValue(0);
    setActiveScreen(screen);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRegistrationSuccess = (data: RegisterResponse) => {
    setLatestRegistration(data);
    setShowSplash(true);
  };

  const handleSplashContinue = () => {
    setShowSplash(false);
  };

  const handleLogout = () => {
    setLatestRegistration(null);
    setShowSplash(false);
    setActiveScreen('dashboard');
  };

  if (isLoadingSession) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background.canvas },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.brand.primary} />
      </View>
    );
  }

  // Show Party Welcome / Banner Splash screen immediately after registration
  if (showSplash && (latestRegistration?.politician || politician)) {
    return (
      <PartyWelcomeScreen
        politician={latestRegistration?.politician || politician}
        onContinue={handleSplashContinue}
      />
    );
  }

  // Authenticated state: Smoothly animated transition between Screens
  if (isAuthenticated) {
    return (
      <View style={[styles.screenWrapper, { backgroundColor: theme.colors.background.canvas }]}>
        <Animated.View
          style={[
            styles.animatedScreen,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {activeScreen === 'profile' ? (
            <ProfileScreen
              onBack={() => navigateTo('dashboard')}
              onLogout={handleLogout}
            />
          ) : activeScreen === 'search' ? (
            <SearchScreen
              onBack={() => navigateTo('dashboard')}
            />
          ) : (
            <DashboardScreen
              onOpenProfile={() => navigateTo('profile')}
              onOpenSearch={() => navigateTo('search')}
              onLogout={handleLogout}
            />
          )}
        </Animated.View>
      </View>
    );
  }

  // Default initial screen is the Register screen
  return <RegisterScreen onSuccess={handleRegistrationSuccess} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenWrapper: {
    flex: 1,
  },
  animatedScreen: {
    flex: 1,
  },
});
