import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, useWindowDimensions, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const px = Math.max(width * 0.04, 12);
  
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    Alert.alert('Thank you!', 'Your feedback has been submitted successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 40 : 0) + 8, paddingHorizontal: px }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#dee3e7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FEEDBACK</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px, paddingTop: 24, flexGrow: 1 }}>
        <Text style={styles.subtitle}>We'd love to hear your thoughts on how we can improve the app!</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            multiline
            numberOfLines={6}
            placeholder="Type your feedback here..."
            placeholderTextColor="#859398"
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, { opacity: feedback.trim() ? 1 : 0.5 }]} 
          onPress={handleSubmit}
          disabled={!feedback.trim()}
        >
          <Feather name="send" size={20} color="#003642" />
          <Text style={styles.submitText}>SUBMIT</Text>
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
  subtitle: { fontSize: 16, color: '#dee3e7', marginBottom: 24, lineHeight: 22 },
  inputContainer: {
    backgroundColor: '#1a2024', borderWidth: 2, borderColor: '#000',
    padding: 12, marginBottom: 24, ...neo,
  },
  input: { fontSize: 16, color: '#dee3e7', minHeight: 150 },
  submitBtn: {
    backgroundColor: '#6cf4e0', borderWidth: 2, borderColor: '#000',
    paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    ...neo, gap: 8,
  },
  submitText: { fontSize: 16, fontWeight: '900', color: '#003642', letterSpacing: 1 },
});
