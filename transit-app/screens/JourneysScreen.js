import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { UrlTile, Polyline, Marker } from '../components/Map';

const API_HOST = Platform.OS === 'web' ? 'localhost' : '192.168.1.5';
const modeIcons = { BUS: 'bus', METRO: 'subway', TRAIN: 'train', WALK: 'walk' };
const modeColors = { BUS: '#ffb95f', METRO: '#a8e8ff', TRAIN: '#6cf4e0', WALK: '#a8e8ff' };

export default function JourneysScreen() {
  const params = useLocalSearchParams();
  const [origin, setOrigin] = useState(params.origin || '');
  const [destination, setDestination] = useState(params.destination || '');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('FASTEST');
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const TAB_BAR_HEIGHT = 60 + Math.max(insets.bottom, 8);
  const px = Math.max(width * 0.04, 12);

  async function handleSearch() {
    if (!origin || !destination) return;
    setLoading(true);
    try {
      const response = await fetch(`http://${API_HOST}:3000/api/journeys?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
      const data = await response.json();
      setRoutes(data.routes || []);
      if (data.routes && data.routes.length > 0) {
        setSelectedRouteId(data.routes[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.origin && params.destination) {
      handleSearch();
    }
  }, [params.origin, params.destination]);

  const sortedRoutes = [...routes].sort((a, b) => {
    if (activeFilter === 'CHEAPEST') return parseInt(a.fare.replace('₹', '')) - parseInt(b.fare.replace('₹', ''));
    return a.sortValue - b.sortValue;
  });

  const filterColors = { FASTEST: '#ffb95f', CHEAPEST: '#6cf4e0', PREFERENCES: '#1a2024' };
  const filterOnColors = { FASTEST: '#472a00', CHEAPEST: '#003731', PREFERENCES: '#dee3e7' };

  const selectedRoute = sortedRoutes.find(r => r.id === selectedRouteId) || sortedRoutes[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 24 }}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="bus-side" size={28} color="#dee3e7" />
          <Text style={styles.headerTitle}>TRANSITONE</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/account')}>
          <Feather name="user" size={28} color="#bbc9cf" />
        </TouchableOpacity>
      </View>

      {/* Interactive Map Area */}
      {selectedRoute && selectedRoute.path && (
        <View style={{ height: width * 0.6, width: '100%', borderWidth: 2, borderColor: '#000', marginBottom: 16 }}>
          <MapView 
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: selectedRoute.path[0].latitude,
              longitude: selectedRoute.path[0].longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            mapType="none"
          >
            <UrlTile 
              urlTemplate="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            <Polyline 
              coordinates={selectedRoute.path} 
              strokeColor="#6cf4e0" 
              strokeWidth={4} 
            />
            <Marker coordinate={selectedRoute.path[0]}>
              <View style={styles.mapDotOrig} />
            </Marker>
            <Marker coordinate={selectedRoute.path[selectedRoute.path.length - 1]}>
              <View style={styles.mapDotDest} />
            </Marker>
          </MapView>
        </View>
      )}

      <View style={[styles.content, { paddingHorizontal: px }]}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={20} color="#a8e8ff" style={styles.inputIcon} />
            <TextInput style={styles.inputField} placeholder="Origin" placeholderTextColor="rgba(187,201,207,0.5)" value={origin} onChangeText={setOrigin} />
          </View>
          <View style={{ alignItems: 'center', marginVertical: -6, zIndex: 2 }}>
            <TouchableOpacity style={styles.swapButton}>
              <Ionicons name="swap-vertical" size={20} color="#003642" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="pin-outline" size={20} color="#ffb95f" style={styles.inputIcon} />
            <TextInput style={styles.inputField} placeholder="Where to?" placeholderTextColor="rgba(187,201,207,0.5)" value={destination} onChangeText={setDestination} />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>FIND ROUTES</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ paddingRight: 16 }}>
          {['FASTEST', 'CHEAPEST', 'PREFERENCES'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && { backgroundColor: filterColors[filter] }]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterChipText, activeFilter === filter && { color: filterOnColors[filter] }]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#3cd7ff" style={{ marginTop: 40 }} />
        ) : (
          <>
            {sortedRoutes.length > 0 && <Text style={styles.sectionTitle}>Suggested Routes</Text>}

            {sortedRoutes.map((item, idx) => (
              <TouchableOpacity key={item.id} style={[styles.routeCard, selectedRouteId === item.id && styles.routeCardSelected]} onPress={() => setSelectedRouteId(item.id)} activeOpacity={0.9}>
                {idx === 0 && (
                  <View style={styles.recommendedBadge}><Text style={styles.recommendedText}>RECOMMENDED</Text></View>
                )}
                <View style={styles.routeCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.timeRange} numberOfLines={1}>{item.time}</Text>
                    <Text style={styles.frequency}>Every 10 mins</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.fareText, { color: idx === 0 ? '#ffb95f' : '#6cf4e0' }]}>{item.fare}</Text>
                    <Text style={styles.zoneLabel}>{item.interchanges === 0 ? 'DIRECT' : `${item.interchanges} CHANGES`}</Text>
                  </View>
                </View>
                <View style={styles.timeline}>
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineIcons}>
                    {item.legs.map((leg, li) => (
                      <View key={li} style={[styles.timelineIcon, { backgroundColor: modeColors[leg] || '#343a3d' }]}>
                        <MaterialCommunityIcons name={modeIcons[leg] || 'walk'} size={18} color="#1a2024" />
                      </View>
                    ))}
                    <View style={[styles.timelineIcon, { backgroundColor: '#343a3d' }]}>
                      <MaterialCommunityIcons name="flag-checkered" size={18} color="#dee3e7" />
                    </View>
                  </View>
                </View>
                <View style={styles.routeCardFooter}>
                  <TouchableOpacity><Text style={styles.detailsLink}>DETAILS →</Text></TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {sortedRoutes.length > 0 && (
              <View style={styles.alertCard}>
                <Feather name="alert-triangle" size={24} color="#ffb4ab" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>Service Advisory</Text>
                  <Text style={styles.alertDesc}>Check for delays on selected routes. Bus replacement services may be active.</Text>
                </View>
              </View>
            )}

            {sortedRoutes.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Feather name="map" size={48} color="#859398" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyTitle}>Plan Your Journey</Text>
                <Text style={styles.emptyDesc}>Enter origin and destination above to find the best transit routes.</Text>
              </View>
            )}
          </>
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
  content: { paddingTop: 8 },
  searchSection: { marginBottom: 20 },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 14, zIndex: 1 },
  inputField: {
    backgroundColor: '#050708', borderWidth: 2, borderColor: '#000',
    padding: 14, paddingLeft: 40,
    fontSize: 16, fontWeight: '700', color: '#dee3e7',
    ...neo,
  },
  swapButton: {
    backgroundColor: '#a8e8ff', padding: 6,
    borderWidth: 2, borderColor: '#000',
    ...neoSm,
  },
  searchButton: {
    backgroundColor: '#a8e8ff', padding: 14, marginTop: 10,
    borderWidth: 2, borderColor: '#000', alignItems: 'center',
    ...neo,
  },
  searchButtonText: { fontSize: 16, fontWeight: '800', color: '#003642', textTransform: 'uppercase' },
  filterChip: {
    backgroundColor: '#1a2024', borderWidth: 2, borderColor: '#000',
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    ...neoSm,
  },
  filterChipText: { fontSize: 11, fontWeight: '700', color: '#dee3e7' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#dee3e7', marginBottom: 14 },
  routeCard: {
    backgroundColor: 'rgba(26,32,36,0.85)', borderWidth: 2, borderColor: '#000',
    padding: 14, marginBottom: 14, overflow: 'hidden',
    ...neo,
  },
  routeCardSelected: {
    borderColor: '#6cf4e0',
    backgroundColor: 'rgba(26,32,36,1)',
  },
  recommendedBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#ffb95f', paddingHorizontal: 10, paddingVertical: 3,
    borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#000',
  },
  recommendedText: { fontSize: 9, fontWeight: '700', color: '#472a00' },
  routeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  timeRange: { fontSize: 20, fontWeight: '800', color: '#a8e8ff' },
  frequency: { fontSize: 12, color: '#bbc9cf', marginTop: 3 },
  fareText: { fontSize: 18, fontWeight: '700' },
  zoneLabel: { fontSize: 10, fontWeight: '700', color: '#bbc9cf', marginTop: 3 },
  timeline: { paddingVertical: 14, position: 'relative' },
  timelineLine: { height: 6, backgroundColor: '#000', position: 'absolute', left: 0, right: 0, top: '50%' },
  timelineIcons: { flexDirection: 'row', justifyContent: 'space-between', position: 'relative', zIndex: 1 },
  timelineIcon: {
    width: 36, height: 36, borderWidth: 2, borderColor: '#000',
    justifyContent: 'center', alignItems: 'center',
    ...neoSm,
  },
  routeCardFooter: { marginTop: 14, paddingTop: 14, borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.2)', alignItems: 'flex-end' },
  detailsLink: { fontSize: 11, fontWeight: '700', color: '#a8e8ff' },
  alertCard: {
    backgroundColor: 'rgba(147,0,10,0.4)', borderWidth: 2, borderColor: '#ffb4ab',
    padding: 14, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24,
    ...neo,
  },
  alertTitle: { fontSize: 18, fontWeight: '700', color: '#ffb4ab', marginBottom: 3 },
  alertDesc: { fontSize: 13, color: '#ffdad6', lineHeight: 19 },
  emptyState: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#a8e8ff', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#859398', textAlign: 'center', paddingHorizontal: 24, lineHeight: 20 },
  mapDotOrig: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#ffb95f', borderWidth: 2, borderColor: '#000' },
  mapDotDest: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#6cf4e0', borderWidth: 2, borderColor: '#000' },
});
