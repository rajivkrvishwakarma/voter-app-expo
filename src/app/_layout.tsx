import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { AppProviders } from '@/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      />
    </AppProviders>
  );
}
