import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  const icons = {
    index: { component: MaterialIcons, name: 'sensors', label: 'Live' },
    journeys: { component: Feather, name: 'map', label: 'Routes' },
    alerts: { component: Feather, name: 'alert-triangle', label: 'Alerts' },
    explore: { component: Feather, name: 'bookmark', label: 'Saved' },
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconInfo = icons[route.name];

        if (!iconInfo) return null;
        
        const IconComponent = iconInfo.component;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
          >
            <IconComponent name={iconInfo.name} size={24} color={isFocused ? '#000' : '#dee3e7'} />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{iconInfo.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="journeys" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0e1417',
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingTop: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 70,
  },
  tabItemActive: {
    backgroundColor: '#ffb95f',
    borderWidth: 2,
    borderColor: '#000',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
      android: { elevation: 4 },
    }),
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dee3e7',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#000',
  },
});
