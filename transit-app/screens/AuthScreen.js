import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, useWindowDimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../store';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const px = Math.max(width * 0.04, 12);
  
  const login = useStore(state => state.login);
  const register = useStore(state => state.register);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      router.replace('/account'); // Or go back to where they were
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#dee3e7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isLogin ? 'LOGIN' : 'REGISTER'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px, paddingTop: 24, flexGrow: 1 }}>
        <Text style={styles.subtitle}>
          {isLogin ? 'Welcome back! Log in to access your saved routes and pro features.' : 'Create an account to save your routes and access pro features.'}
        </Text>
        
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>FULL NAME</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color="#859398" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
                placeholderTextColor="#859398"
                placeholder="Alex Commuter" 
              />
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#859398" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholderTextColor="#859398"
              placeholder="alex@example.com" 
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#859398" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={password} 
              onChangeText={setPassword} 
              placeholderTextColor="#859398"
              placeholder="••••••••" 
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, { opacity: isLoading ? 0.7 : 1 }]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#003642" />
          ) : (
            <>
              <Text style={styles.submitText}>{isLogin ? 'LOG IN' : 'REGISTER'}</Text>
              <Feather name="chevron-right" size={20} color="#003642" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleBtn}>{isLogin ? 'Register' : 'Log In'}</Text>
          </TouchableOpacity>
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#a8e8ff', letterSpacing: -1 },
  subtitle: { fontSize: 15, color: '#bbc9cf', marginBottom: 24, lineHeight: 22 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '800', color: '#a8e8ff', marginBottom: 8, letterSpacing: 1 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a2024',
    borderWidth: 2, borderColor: '#000', ...neoSm,
  },
  inputIcon: { padding: 12, borderRightWidth: 2, borderRightColor: '#000' },
  input: { flex: 1, padding: 12, fontSize: 16, color: '#dee3e7', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#6cf4e0', borderWidth: 2, borderColor: '#000',
    paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 12, ...neo, gap: 8,
  },
  submitText: { fontSize: 16, fontWeight: '900', color: '#003642', letterSpacing: 1 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  toggleText: { color: '#859398', fontSize: 15 },
  toggleBtn: { color: '#ffb95f', fontSize: 15, fontWeight: '800' }
});
