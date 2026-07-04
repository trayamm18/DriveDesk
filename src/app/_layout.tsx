import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toast } from '@/components/ui/Toast';
import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(owner)" />
        <Stack.Screen name="(agent)" />
        <Stack.Screen name="vehicle/[id]" />
        <Stack.Screen name="booking/new" />
        <Stack.Screen name="customer/[id]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="activity" />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
}
