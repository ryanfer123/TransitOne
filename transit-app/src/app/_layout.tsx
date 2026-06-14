import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore } from '../../store';

const API_BASE = `http://localhost:3000`;
const WS_URL = `ws://localhost:3000/ws`;

export default function RootLayout() {
  const setVehicles = useStore((state) => state.setVehicles);
  const fetchUser = useStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();

    const startMockSimulation = useStore.getState().startMockSimulation;
    startMockSimulation();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0e1417" translucent={false} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0e1417' } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}

