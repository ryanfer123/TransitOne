import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { UrlTile, Marker } from 'react-native-maps';

const modeIcons = { BUS: 'bus', METRO: 'subway', TRAIN: 'train' };
const modeColors = { BUS: '#ffb95f', METRO: '#00d4ff', TRAIN: '#6cf4e0' };

export default function HomeScreen() {
  const { vehicles, searchQuery, setSearchQuery } = useStore();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const mapHeight = height * 0.38;
  const cardWidth = Math.min(width * 0.72, 280);
  const TAB_BAR_HEIGHT = 60 + Math.max(insets.bottom, 8);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return vehicles;
    const lowerQ = searchQuery.toLowerCase();
    return vehicles.filter(v =>
      v.routeId.toLowerCase().includes(lowerQ) ||
      v.nextStops.some(s => s.stopName.toLowerCase().includes(lowerQ))
    );
  }, [vehicles, searchQuery]);

  const nearYou = filteredVehicles.slice(0, 5);

  const renderArrivalCard = ({ item }) => {
    const color = modeColors[item.mode] || '#a8e8ff';
    const eta = Math.max(0, Math.floor((item.nextStops[0]?.eta - Date.now() / 1000) / 60));
    const stopName = item.nextStops[0]?.stopName || 'Unknown';
    const status = item.status === 'DELAYED' ? 'DELAYED' : 'ON TIME';
    const iconName = modeIcons[item.mode] || 'bus';

    return (
      <TouchableOpacity style={[styles.arrivalCard, { width: cardWidth }]} activeOpacity={0.9}>
        <View style={styles.arrivalCardHeader}>
          <View style={[styles.modeIconBox, { backgroundColor: color }]}>
            <MaterialCommunityIcons name={iconName} size={24} color="#1a2024" />
          </View>
          <View style={[styles.statusBadge, { borderColor: color }]}>
            <Text style={[styles.statusText, { color }]}>{status}</Text>
          </View>
        </View>
        <View style={{ marginTop: 8 }}>
          <Text style={styles.routeLabel} numberOfLines={1}>{item.routeId}</Text>
          <Text style={styles.stopLabel} numberOfLines={1}>{stopName}</Text>
        </View>
        <View style={styles.arrivalCardFooter}>
          <Text style={[styles.arrivalLabel, { color }]}>Arriving</Text>
          <Text style={[styles.etaBig, { color }]}>
            {String(eta).padStart(2, '0')}
            <Text style={styles.etaUnit}>min</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8 }]}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="bus-side" size={28} color="#dee3e7" />
          <Text style={styles.headerTitle}>TRANSITONE</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/account')}>
          <Feather name="user" size={28} color="#a8e8ff" />
        </TouchableOpacity>
      </View>

      {/* Map Area */}
      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <MapView 
          style={StyleSheet.absoluteFillObject} 
          initialRegion={{
            latitude: 13.0827,
            longitude: 80.2707,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType="none" // we provide custom tiles
        >
          <UrlTile 
            urlTemplate="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {filteredVehicles.map((v) => (
            <Marker key={v.id} coordinate={{ latitude: v.lat, longitude: v.lon }}>
              <View style={[styles.vehicleDot, { backgroundColor: modeColors[v.mode] || '#a8e8ff' }]} />
            </Marker>
          ))}
        </MapView>

        {/* Search Bar */}
        <View style={[styles.searchBar, { left: width * 0.04, right: width * 0.04, top: 12 }]}>
          <Feather name="search" size={20} color="#bbc9cf" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="rgba(187,201,207,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.goButton}>
            <Text style={styles.goButtonText}>GO</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Near You Drawer */}
      <View style={styles.drawer}>
        <View style={styles.drawerHandle} />
        <Text style={styles.drawerTitle}>NEAR YOU</Text>
        <FlatList
          data={nearYou}
          keyExtractor={v => v.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16, paddingBottom: TAB_BAR_HEIGHT + 16 }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <MaterialIcons name="sensors" size={48} color="#859398" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>Connecting to live transit feed…</Text>
            </View>
          }
          renderItem={renderArrivalCard}
        />
      </View>
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
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: '#0e1417',
    borderBottomWidth: 3, borderBottomColor: '#000',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#a8e8ff', letterSpacing: -1 },
  avatarBtn: { padding: 4 },
  mapContainer: { width: '100%', position: 'relative', backgroundColor: '#050708', overflow: 'hidden' },
  vehicleDot: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2, borderColor: 'rgba(0,0,0,0.5)',
  },
  searchBar: {
    position: 'absolute', backgroundColor: 'rgba(26,32,36,0.9)',
    borderWidth: 2, borderColor: '#000',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    ...neo,
  },
  searchInput: { flex: 1, color: '#dee3e7', fontSize: 16, fontWeight: '700' },
  goButton: {
    backgroundColor: '#a8e8ff', paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 2, borderColor: '#000',
    ...neoSm,
  },
  goButtonText: { fontSize: 11, fontWeight: '700', color: '#003642' },
  drawer: {
    flex: 1, backgroundColor: 'rgba(26,32,36,0.85)',
    borderTopLeftRadius: 14, borderTopRightRadius: 14,
    borderWidth: 2, borderColor: '#000', borderBottomWidth: 0,
    marginTop: -10, paddingTop: 8, paddingHorizontal: 16,
  },
  drawerHandle: { width: 40, height: 5, backgroundColor: 'rgba(187,201,207,0.3)', borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  drawerTitle: { fontSize: 18, fontWeight: '700', color: '#dee3e7', borderBottomWidth: 2, borderBottomColor: '#000', alignSelf: 'flex-start', marginBottom: 14, textTransform: 'uppercase', paddingBottom: 4 },
  arrivalCard: {
    backgroundColor: 'rgba(26,32,36,0.85)', borderWidth: 2, borderColor: '#000',
    padding: 14, marginRight: 12,
    ...neo,
  },
  arrivalCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  modeIconBox: { width: 44, height: 44, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  statusBadge: { backgroundColor: '#000', paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: '700' },
  routeLabel: { fontSize: 11, fontWeight: '700', color: '#bbc9cf', textTransform: 'uppercase' },
  stopLabel: { fontSize: 18, fontWeight: '700', color: '#dee3e7', marginTop: 2 },
  arrivalCardFooter: {
    marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.15)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  arrivalLabel: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase' },
  etaBig: { fontSize: 32, fontWeight: '900' },
  etaUnit: { fontSize: 16 },
  emptyBox: { alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 14, color: '#859398', textAlign: 'center' },
});
