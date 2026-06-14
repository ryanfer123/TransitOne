import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const px = Math.max(width * 0.04, 12);

  const faqs = [
    { q: 'How do I save a route?', a: 'Tap the star icon next to any route in the Journeys screen.' },
    { q: 'Can I track a bus live?', a: 'Yes! Select any bus to view its real-time location.' },
    { q: 'How is the fare calculated?', a: 'Fares are estimated based on base agency rates.' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#dee3e7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HELP CENTER</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px, paddingTop: 24, paddingBottom: 40 }}>
        <TouchableOpacity style={styles.contactBtn}>
          <Feather name="life-buoy" size={20} color="#0e1417" />
          <Text style={styles.contactText}>CONTACT SUPPORT</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
        
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.faqQ}>{faq.q}</Text>
            <Text style={styles.faqA}>{faq.a}</Text>
          </View>
        ))}
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
  contactBtn: {
    backgroundColor: '#a8e8ff', borderWidth: 2, borderColor: '#000',
    paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: 32, ...neo, gap: 8,
  },
  contactText: { fontSize: 16, fontWeight: '900', color: '#0e1417', letterSpacing: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#859398', marginBottom: 16, letterSpacing: 1 },
  faqCard: {
    backgroundColor: '#1a2024', borderWidth: 2, borderColor: '#000',
    padding: 16, marginBottom: 16, ...neo,
  },
  faqQ: { fontSize: 16, fontWeight: '800', color: '#dee3e7', marginBottom: 8 },
  faqA: { fontSize: 14, color: '#bbc9cf', lineHeight: 20 },
});
