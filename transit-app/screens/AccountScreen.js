import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useWindowDimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../store';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const px = Math.max(width * 0.04, 12);
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);

  const handleComingSoon = () => Alert.alert('Coming Soon', 'This feature is not yet available.');

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: 'edit-2', color: '#a8e8ff', onPress: () => router.push('/edit-profile') },
    { id: '2', title: 'Payment Methods', icon: 'credit-card', color: '#ffb95f', onPress: () => router.push('/payment-methods') },
    { id: '3', title: 'Notifications', icon: 'bell', color: '#6cf4e0', onPress: () => router.push('/notifications-settings') },
    { id: '4', title: 'App Settings', icon: 'settings', color: '#dee3e7', onPress: () => router.push('/app-settings') },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#dee3e7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ACCOUNT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px, paddingBottom: insets.bottom + 40, paddingTop: 24 }}>
        {/* Profile Card */}
        {user ? (
          <View style={styles.profileCard}>
            <View style={styles.avatarBox}>
              <Feather name="user" size={40} color="#003642" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.isPro && (
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>TRANSIT PRO</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <View style={styles.avatarBox}>
              <Feather name="user-x" size={40} color="#003642" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>Guest</Text>
              <Text style={styles.userEmail}>Log in to save routes</Text>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuRow} onPress={item.onPress}>
              <View style={[styles.menuIconBox, { backgroundColor: item.color }]}>
                <Feather name={item.icon} size={20} color="#000" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Feather name="chevron-right" size={20} color="#859398" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/help-center')}>
            <View style={[styles.menuIconBox, { backgroundColor: '#303639' }]}>
              <Feather name="help-circle" size={20} color="#dee3e7" />
            </View>
            <Text style={styles.menuText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/feedback')}>
            <View style={[styles.menuIconBox, { backgroundColor: '#303639' }]}>
              <Feather name="message-square" size={20} color="#dee3e7" />
            </View>
            <Text style={styles.menuText}>Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        {user ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Feather name="log-out" size={20} color="#690005" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: '#a8e8ff' }]} onPress={() => router.push('/auth')}>
            <Feather name="log-in" size={20} color="#003642" style={{ marginRight: 8 }} />
            <Text style={[styles.logoutText, { color: '#003642' }]}>LOG IN</Text>
          </TouchableOpacity>
        )}
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#a8e8ff', letterSpacing: -1 },
  profileCard: {
    backgroundColor: 'rgba(26,32,36,0.85)', borderWidth: 2, borderColor: '#000',
    padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16,
    marginBottom: 24, ...neo,
  },
  avatarBox: {
    width: 80, height: 80, backgroundColor: '#a8e8ff',
    borderWidth: 2, borderColor: '#000', borderRadius: 40,
    justifyContent: 'center', alignItems: 'center', ...neoSm,
  },
  userName: { fontSize: 22, fontWeight: '800', color: '#dee3e7', marginBottom: 2 },
  userEmail: { fontSize: 14, color: '#bbc9cf', marginBottom: 8 },
  proBadge: {
    backgroundColor: '#ffb95f', alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 2, borderColor: '#000',
  },
  proBadgeText: { fontSize: 9, fontWeight: '800', color: '#472a00', letterSpacing: 1 },
  menuContainer: {
    backgroundColor: '#1a2024', borderWidth: 2, borderColor: '#000',
    marginBottom: 32, ...neo,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderBottomWidth: 2, borderBottomColor: '#000',
  },
  menuIconBox: {
    width: 40, height: 40, borderWidth: 2, borderColor: '#000',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
    ...neoSm,
  },
  menuText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#dee3e7' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#859398', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  logoutBtn: {
    backgroundColor: '#ffb4ab', borderWidth: 2, borderColor: '#000',
    paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    ...neo,
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#690005', textTransform: 'uppercase' },
});
