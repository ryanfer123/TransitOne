import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../store';

const favoriteStops = [
  { name: 'Grand Central Terminal', sub: 'Platforms 42-43 • Metro North', icon: 'train', color: '#a8e8ff', eta: '02:15' },
  { name: '8th Ave & 14th St', sub: 'Westbound • M14-SBS', icon: 'bus', color: '#ffb95f', eta: '08:00' },
  { name: 'Bedford Av Station', sub: 'L Train • Manhattan Bound', icon: 'subway', color: '#6cf4e0', eta: '14:55' },
];

const recentSearches = ['JFK Airport Terminal 4', 'Williamsburg Bridge Path', 'Dumbo Ferry Terminal'];

export default function ExploreScreen() {
  const { savedRoutes } = useStore();
  const [etas, setEtas] = useState(favoriteStops.map(s => s.eta));
  const [recentSearchesList, setRecentSearchesList] = useState(recentSearches);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const TAB_BAR_HEIGHT = 60 + Math.max(insets.bottom, 8);
  const px = Math.max(width * 0.04, 12);

  // Tick down ETAs every second for the live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setEtas(prev => prev.map(eta => {
        const parts = eta.split(':');
        let mins = parseInt(parts[0], 10), secs = parseInt(parts[1], 10);
        if (secs > 0) secs--;
        else if (mins > 0) { mins--; secs = 59; }
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 24 }}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="bus-side" size={28} color="#dee3e7" />
          <Text style={styles.headerTitle}>TRANSITONE</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/account')}>
          <Feather name="user" size={28} color="#a8e8ff" />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { paddingHorizontal: px }]}>
        {/* Pinned Journeys */}
        <View style={styles.sectionRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="pin" size={20} color="#a8e8ff" />
            <Text style={styles.sectionTitle}>Pinned Journeys</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Edit Mode', 'You can now reorder your pinned journeys.')}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
        </View>

        <View style={styles.pinnedGrid}>
          {/* Journey Card 1 */}
          <View style={styles.journeyCard}>
            <View style={styles.journeyBadge}><Text style={styles.journeyBadgeText}>LIVE</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.journeyPlace}>Home</Text>
              <Feather name="arrow-right" size={16} color="#859398" />
              <Text style={styles.journeyPlace}>Work</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <View style={styles.modeChip}>
                <MaterialCommunityIcons name="subway" size={14} color="#003642" />
                <Text style={styles.modeChipText}>L-Line</Text>
              </View>
              <View>
                <Text style={styles.nextLabel}>Next train in</Text>
                <Text style={styles.nextEta}>04:20</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.startButton} onPress={() => router.push({ pathname: '/journeys', params: { origin: 'Home', destination: 'Work' } })}>
              <Feather name="navigation" size={14} color="#003642" style={{ marginRight: 6 }} />
              <Text style={styles.startButtonText}>START JOURNEY</Text>
            </TouchableOpacity>
          </View>

          {/* Journey Card 2 */}
          <View style={styles.journeyCard}>
            <View style={[styles.journeyBadge, { backgroundColor: '#ffb4ab' }]}>
              <Text style={[styles.journeyBadgeText, { color: '#690005' }]}>DELAYED</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.journeyPlace}>Gym</Text>
              <Feather name="arrow-right" size={16} color="#859398" />
              <Text style={styles.journeyPlace}>Home</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <View style={[styles.modeChip, { backgroundColor: '#ffb95f' }]}>
                <MaterialCommunityIcons name="bus" size={14} color="#472a00" />
                <Text style={[styles.modeChipText, { color: '#472a00' }]}>104 Exp</Text>
              </View>
              <View>
                <Text style={styles.nextLabel}>Scheduled</Text>
                <Text style={[styles.nextEta, { color: '#ffb4ab' }]}>18:45 (+12m)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Favorite Stops */}
        <View style={[styles.sectionRow, { marginTop: 16 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="star" size={20} color="#ffb95f" />
            <Text style={styles.sectionTitle}>Favorite Stops</Text>
          </View>
        </View>
        <View style={{ gap: 8 }}>
          {favoriteStops.map((stop, idx) => (
            <TouchableOpacity key={idx} style={styles.stopCard} onPress={() => Alert.alert('Stop Options', `View departures for ${stop.name}`)}>
              <View style={styles.stopIconBox}>
                <MaterialCommunityIcons name={stop.icon} size={24} color={stop.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stopName} numberOfLines={1}>{stop.name}</Text>
                <Text style={styles.stopSub} numberOfLines={1}>{stop.sub}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.stopEta, { color: stop.color }]}>{etas[idx]}</Text>
                <Text style={styles.etaLabel}>ETA</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Searches */}
        <View style={[styles.sectionRow, { marginTop: 32 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="clock" size={20} color="#a8e8ff" />
            <Text style={styles.sectionTitle}>Recent Searches</Text>
          </View>
        </View>
        <View style={styles.recentBox}>
          {recentSearchesList.map((s, i) => (
            <TouchableOpacity key={i} style={styles.recentRow} onPress={() => router.push({ pathname: '/journeys', params: { destination: s } })}>
              <Feather name="search" size={16} color="#859398" />
              <Text style={styles.recentText} numberOfLines={1}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {recentSearchesList.length > 0 && (
        <TouchableOpacity style={{ marginTop: 16, alignItems: 'center', padding: 8 }} onPress={() => setRecentSearchesList([])}>
          <Text style={styles.clearText}>CLEAR RECENT HISTORY</Text>
        </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#a8e8ff', letterSpacing: -1 },
  content: { paddingTop: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#dee3e7' },
  editLink: { fontSize: 11, fontWeight: '700', color: '#ffb95f', textDecorationLine: 'underline' },
  pinnedGrid: { gap: 14, marginBottom: 20 },
  journeyCard: {
    backgroundColor: 'rgba(26,32,36,0.85)',
    borderWidth: 2, borderColor: '#000', padding: 14,
    overflow: 'hidden',
    ...neo,
  },
  journeyBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#6cf4e0', paddingHorizontal: 10, paddingVertical: 3,
    borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#000',
  },
  journeyBadgeText: { fontSize: 9, fontWeight: '700', color: '#003731' },
  journeyPlace: { fontSize: 18, fontWeight: '700', color: '#dee3e7' },
  modeChip: {
    backgroundColor: '#a8e8ff', paddingHorizontal: 6, paddingVertical: 3,
    borderWidth: 2, borderColor: '#000',
    flexDirection: 'row', alignItems: 'center', gap: 4,
    ...neoSm,
  },
  modeChipText: { fontSize: 10, fontWeight: '500', color: '#003642' },
  nextLabel: { fontSize: 12, color: '#bbc9cf' },
  nextEta: { fontSize: 18, fontWeight: '700', color: '#6cf4e0' },
  startButton: {
    marginTop: 14, backgroundColor: '#a8e8ff', paddingVertical: 10,
    borderWidth: 2, borderColor: '#000',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    ...neoSm,
  },
  startButtonText: { fontSize: 11, fontWeight: '700', color: '#003642' },
  stopCard: {
    backgroundColor: 'rgba(26,32,36,0.85)',
    borderWidth: 2, borderColor: '#000', padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  stopIconBox: {
    width: 42, height: 42, backgroundColor: '#303639',
    borderWidth: 2, borderColor: '#000',
    justifyContent: 'center', alignItems: 'center',
    ...neoSm,
  },
  stopName: { fontSize: 15, fontWeight: '700', color: '#dee3e7' },
  stopSub: { fontSize: 12, color: '#bbc9cf', marginTop: 2 },
  stopEta: { fontSize: 18, fontWeight: '700' },
  etaLabel: { fontSize: 9, fontWeight: '700', color: '#859398', marginTop: 2 },
  recentBox: {
    backgroundColor: '#1a2024', borderWidth: 2, borderColor: '#000',
    ...neo,
  },
  recentRow: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 2, borderBottomColor: '#000' },
  recentText: { fontSize: 14, color: '#dee3e7', flex: 1 },
  clearText: { fontSize: 11, fontWeight: '700', color: '#859398' },
});
