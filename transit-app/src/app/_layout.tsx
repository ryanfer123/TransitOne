import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore } from '../../store';

export default function RootLayout() {
  const setVehicles = useStore((state) => state.setVehicles);
  const fetchUser = useStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
    
    const ws = new WebSocket('ws://192.168.1.7:3000/ws');
    ws.onopen = () => console.log('Connected to Transit WebSocket');
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'INIT' || msg.type === 'VEHICLE_UPDATE') {
          setVehicles(msg.data);
        }
      } catch (err) {
        console.error('WebSocket parse error', err);
      }
    };
    return () => ws.close();
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
