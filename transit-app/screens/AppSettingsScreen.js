import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AppSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const px = Math.max(width * 0.04, 12);

  const [darkMode, setDarkMode] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [offlineMaps, setOfflineMaps] = useState(true);
  
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#dee3e7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>APP SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px, paddingTop: 24 }}>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSub}>Use dark theme by default</Text>
            </View>
            <Switch 
              trackColor={{ false: '#303639', true: '#a8e8ff' }}
              thumbColor={darkMode ? '#0e1417' : '#dee3e7'}
              onValueChange={setDarkMode}
              value={darkMode}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Data Saver</Text>
              <Text style={styles.settingSub}>Reduce data usage on mobile networks</Text>
            </View>
            <Switch 
              trackColor={{ false: '#303639', true: '#a8e8ff' }}
              thumbColor={dataSaver ? '#0e1417' : '#dee3e7'}
              onValueChange={setDataSaver}
              value={dataSaver}
            />
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Offline Maps</Text>
              <Text style={styles.settingSub}>Download region maps for offline use</Text>
            </View>
            <Switch 
              trackColor={{ false: '#303639', true: '#a8e8ff' }}
              thumbColor={offlineMaps ? '#0e1417' : '#dee3e7'}
              onValueChange={setOfflineMaps}
              value={offlineMaps}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const neo = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  android: { elevation: 6 },
});
const neoSm = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e1417' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 12, backgroundColor: '#0e1417',
    borderBottomWidth: 3, borderBottomColor: '#000',
  },
  backBtn: {
    width: 40, height: 40, borderWidth: 2, borderColor: '#000',
    backgroundColor: '#303639', justifyContent: 'center', alignItems: 'center',
    ...neoSm,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#dee3e7', letterSpacing: -1 },
  settingsGroup: {
    backgroundColor: '#1a2024', borderWidth: 2, borderColor: '#000',
    ...neo,
  },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 2, borderBottomColor: '#000',
  },
  settingText: { flex: 1, paddingRight: 16 },
  settingTitle: { fontSize: 16, fontWeight: '800', color: '#dee3e7', marginBottom: 4 },
  settingSub: { fontSize: 13, color: '#859398' },
});
