import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { UrlTile, Marker } from '../components/Map';
import { useStore } from '../store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false,
  }),
});

export default function LiveTrackerScreen() {
  const { activeAlerts, toggleAlert, vehicles } = useStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const mapRef = useRef(null);

  const TAB_BAR_HEIGHT = 60 + Math.max(insets.bottom, 8);
  const mapH = height * 0.55;
  const px = Math.max(width * 0.04, 12);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const handleVehicleSelect = (v) => {
    setSelectedVehicleId(v.id);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: v.lat,
        longitude: v.lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  if (vehicles.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#a8e8ff', fontSize: 18 }}>Waiting for vehicle data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="bus-side" size={28} color="#dee3e7" />
          <Text style={styles.headerTitle}>TRANSITONE</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/account')}>
          <Feather name="user" size={28} color="#bbc9cf" />
        </TouchableOpacity>
      </View>

      {/* Map Area */}
      <View style={[styles.mapArea, { height: mapH }]}>
        <MapView 
          ref={mapRef}
          style={StyleSheet.absoluteFillObject} 
          initialRegion={{
            latitude: 13.0418,
            longitude: 80.2341,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          mapType="none"
        >
          <UrlTile 
            urlTemplate="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {vehicles.map(v => (
            <Marker key={v.id} coordinate={{ latitude: v.lat, longitude: v.lon }} onPress={() => handleVehicleSelect(v)}>
              <View style={[styles.mapMarkerContainer, selectedVehicleId === v.id && styles.mapMarkerSelected]}>
                <View style={styles.busHalo} />
                <View style={styles.busIconBox}>
                  <MaterialCommunityIcons name={v.mode === 'BUS' ? 'bus' : 'train'} size={24} color="#1a2024" />
                </View>
                <View style={[styles.busLabel, selectedVehicleId === v.id && { backgroundColor: '#6cf4e0' }]}>
                  <Text style={styles.busLabelText}>{v.mode} {v.routeId}</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Panel */}
      <ScrollView style={styles.panel} contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 24 }}>
        <View style={styles.dragHandle} />
        <View style={{ paddingHorizontal: px }}>
            <Text style={styles.panelTitle}>Live Routes</Text>
            <Text style={styles.panelDesc}>Select a vehicle to view details</Text>
            {vehicles.map(v => (
                <TouchableOpacity 
                    key={v.id} 
                    style={[styles.vehicleListItem, selectedVehicleId === v.id && styles.vehicleListItemSelected]}
                    onPress={() => handleVehicleSelect(v)}
                >
                    <View style={styles.vehicleListIcon}>
                        <MaterialCommunityIcons name={v.mode === 'BUS' ? 'bus' : 'train'} size={20} color="#000" />
                    </View>
                    <View>
                        <Text style={styles.vehicleListTitle}>{v.mode} {v.routeId}</Text>
                        <Text style={styles.vehicleListDesc}>{v.status.replace('_', ' ')} • ID: {v.id}</Text>
                    </View>
                </TouchableOpacity>
            ))}
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#a8e8ff', letterSpacing: -1 },
  mapArea: { backgroundColor: '#050708', position: 'relative', overflow: 'hidden' },
  mapMarkerContainer: { alignItems: 'center', justifyContent: 'center' },
  mapMarkerSelected: { transform: [{ scale: 1.2 }] },
  busHalo: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,185,95,0.3)' },
  busIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffb95f', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  busLabel: { backgroundColor: '#dee3e7', paddingHorizontal: 6, paddingVertical: 2, borderWidth: 2, borderColor: '#000', marginTop: -4 },
  busLabelText: { fontSize: 10, fontWeight: '900', color: '#1a2024' },
  panel: {
    flex: 1, backgroundColor: '#0e1417',
    borderTopWidth: 4, borderTopColor: '#000',
    marginTop: -20, paddingTop: 12, ...neo,
  },
  dragHandle: { width: 40, height: 6, backgroundColor: '#303639', borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  panelTitle: { fontSize: 24, fontWeight: '900', color: '#a8e8ff', letterSpacing: -1 },
  panelDesc: { fontSize: 14, color: '#859398', marginBottom: 8 },
  vehicleListItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a2024', borderWidth: 2, borderColor: '#000',
    padding: 16, marginBottom: 12, ...neoSm,
  },
  vehicleListItemSelected: {
    backgroundColor: '#ffb95f',
  },
  vehicleListIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#dee3e7',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000',
    marginRight: 16,
  },
  vehicleListTitle: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  vehicleListDesc: { fontSize: 12, color: '#bbc9cf', marginTop: 4 },
});
