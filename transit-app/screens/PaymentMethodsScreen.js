import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const px = Math.max(width * 0.04, 12);
  
  const paymentMethods = [
    { id: '1', type: 'Credit Card', last4: '4242', exp: '12/26', icon: 'credit-card', color: '#ffb95f' },
    { id: '2', type: 'Apple Pay', last4: null, exp: null, icon: 'smartphone', color: '#dee3e7' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#dee3e7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAYMENT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px, paddingTop: 24 }}>
        <Text style={styles.sectionTitle}>SAVED METHODS</Text>
        
        {paymentMethods.map(method => (
          <View key={method.id} style={styles.cardBox}>
            <View style={[styles.iconBox, { backgroundColor: method.color }]}>
              <Feather name={method.icon} size={24} color="#0e1417" />
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardType}>{method.type}</Text>
              {method.last4 && <Text style={styles.cardNumber}>•••• {method.last4}</Text>}
            </View>
            <TouchableOpacity style={styles.deleteBtn}>
              <Feather name="trash-2" size={20} color="#ffb4ab" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn}>
          <Feather name="plus" size={20} color="#003642" />
          <Text style={styles.addText}>ADD NEW CARD</Text>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#ffb95f', letterSpacing: -1 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#859398', marginBottom: 12, letterSpacing: 1 },
  cardBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a2024',
    borderWidth: 2, borderColor: '#000', padding: 16, marginBottom: 16,
    ...neo,
  },
  iconBox: {
    width: 50, height: 50, borderRadius: 8, borderWidth: 2, borderColor: '#000',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
    ...neoSm,
  },
  cardDetails: { flex: 1 },
  cardType: { fontSize: 18, fontWeight: '800', color: '#dee3e7', marginBottom: 4 },
  cardNumber: { fontSize: 14, color: '#859398', fontWeight: '600' },
  deleteBtn: { padding: 8 },
  addBtn: {
    backgroundColor: '#ffb95f', borderWidth: 2, borderColor: '#000',
    paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 16, ...neo, gap: 8,
  },
  addText: { fontSize: 16, fontWeight: '900', color: '#003642', letterSpacing: 1 },
});
