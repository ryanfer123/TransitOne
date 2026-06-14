import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const alerts = [
  {
    id: '1', severity: 'CRITICAL DISRUPTION', severityColor: '#ffb4ab', stripColor: '#ffb4ab',
    icon: 'subway', iconBg: '#93000a',
    title: 'Line 4: Northbound Suspended',
    desc: 'Signal failure at Central Station. Maintenance crews are on-site. No service between Oak Park and Downtown until further notice.',
    tags: ['Bus Bridge Active', '+45min Delay'], time: '2m ago',
  },
  {
    id: '2', severity: 'MAJOR DELAY', severityColor: '#ffb95f', stripColor: '#ffb95f',
    icon: 'bus', iconBg: '#ee9800',
    title: 'Route 102: Congestion Diversion',
    desc: 'Heavy traffic on Broadway causing 20-minute delays. Buses are diverting via 5th Ave. Missing stops: 12th St to 24th St.',
    tags: ['Route Diverted'], time: '14m ago',
  },
  {
    id: '3', severity: 'PLANNED WORK', severityColor: '#6cf4e0', stripColor: '#6cf4e0',
    icon: 'train', iconBg: '#4ad7c4',
    title: 'Weekend Track Maintenance',
    desc: 'Regional Express tracks will undergo scheduled maintenance starting Friday 10 PM. Expect modified frequency of 30 mins.',
    tags: ['Starts Oct 12'], time: '1h ago',
  },
];

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const TAB_BAR_HEIGHT = 60 + Math.max(insets.bottom, 8);
  const px = Math.max(width * 0.04, 12);

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

      <View style={[styles.content, { paddingHorizontal: px }]}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionSubtitle}>STATUS CENTER</Text>
            <Text style={styles.sectionTitle}>Network Alerts</Text>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => Alert.alert('Filter', 'Filter options will appear here.')}>
            <Ionicons name="filter" size={20} color="#dee3e7" />
          </TouchableOpacity>
        </View>

        {/* Alert Cards */}
        {alerts.map((alert) => (
          <TouchableOpacity key={alert.id} style={styles.alertCard} activeOpacity={0.9} onPress={() => Alert.alert(alert.title, alert.desc)}>
            <View style={[styles.colorStrip, { backgroundColor: alert.stripColor }]} />
            <View style={styles.alertBody}>
              <View style={[styles.alertIconBox, { backgroundColor: alert.iconBg }]}>
                <MaterialCommunityIcons name={alert.icon} size={28} color="#1a2024" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <View style={[styles.severityBadge, { borderColor: alert.severityColor }]}>
                    <Text style={[styles.severityText, { color: alert.severityColor }]}>{alert.severity}</Text>
                  </View>
                  <Text style={styles.timeText}>{alert.time}</Text>
                </View>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDesc}>{alert.desc}</Text>
                <View style={styles.tagsRow}>
                  {alert.tags.map((tag, ti) => (
                    <View key={ti} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const neo = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  android: { elevation: 6 },
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
  content: { paddingTop: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    borderBottomWidth: 2, borderBottomColor: '#000', paddingBottom: 14, marginBottom: 20,
  },
  sectionSubtitle: { fontSize: 11, fontWeight: '700', color: '#ffb95f', letterSpacing: 2, marginBottom: 3 },
  sectionTitle: { fontSize: 26, fontWeight: '800', color: '#dee3e7', letterSpacing: -0.5 },
  filterButton: {
    backgroundColor: '#252b2e', borderWidth: 2, borderColor: '#000', padding: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
      android: { elevation: 3 },
    }),
  },
  alertCard: {
    backgroundColor: 'rgba(26,32,36,0.85)',
    borderWidth: 2, borderColor: '#000',
    marginBottom: 20, overflow: 'hidden',
    ...neo,
  },
  colorStrip: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  alertBody: { padding: 16, flexDirection: 'row', gap: 12 },
  alertIconBox: { width: 48, height: 48, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  severityBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  severityText: { fontSize: 9, fontWeight: '700' },
  timeText: { fontSize: 12, fontWeight: '500', color: '#bbc9cf' },
  alertTitle: { fontSize: 16, fontWeight: '700', color: '#dee3e7', marginBottom: 6 },
  alertDesc: { fontSize: 13, color: '#bbc9cf', lineHeight: 19, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#303639', borderWidth: 2, borderColor: '#000', paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '500', color: '#dee3e7' },
});
