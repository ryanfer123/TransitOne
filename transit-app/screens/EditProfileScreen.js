import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, useWindowDimensions, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../store';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const px = Math.max(width * 0.04, 12);
  
  const user = useStore(state => state.user);
  const updateUser = useStore(state => state.updateUser);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    updateUser({ name, email });
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#dee3e7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT PROFILE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px, paddingTop: 24 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>FULL NAME</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#859398" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholderTextColor="#859398"
              placeholder="Enter your name" 
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#859398" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholderTextColor="#859398"
              placeholder="Enter your email" 
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>SAVE CHANGES</Text>
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#a8e8ff', letterSpacing: -1 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '800', color: '#a8e8ff', marginBottom: 8, letterSpacing: 1 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a2024',
    borderWidth: 2, borderColor: '#000', ...neoSm,
  },
  inputIcon: { padding: 12, borderRightWidth: 2, borderRightColor: '#000' },
  input: { flex: 1, padding: 12, fontSize: 16, color: '#dee3e7', fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#6cf4e0', borderWidth: 2, borderColor: '#000',
    paddingVertical: 16, justifyContent: 'center', alignItems: 'center',
    marginTop: 24, ...neo,
  },
  saveText: { fontSize: 16, fontWeight: '900', color: '#003642', letterSpacing: 1 },
});
