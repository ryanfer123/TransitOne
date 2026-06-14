import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

function futureEta(minutesFromNow) {
  return Math.floor(Date.now() / 1000) + minutesFromNow * 60;
}

const mockVehicles = [
  { id: 'v1', mode: 'BUS', routeId: '19B', lat: 13.0604, lon: 80.2496, heading: 90, status: 'ON_TIME', occupancy: 'CROWDED', speed: 25, nextStops: [
    { stopId: 's1', stopName: 'T. Nagar', eta: futureEta(3), status: 'ON_TIME' },
    { stopId: 's2', stopName: 'Mambalam', eta: futureEta(8), status: 'ON_TIME' },
  ]},
  { id: 'v2', mode: 'BUS', routeId: '21G', lat: 13.0418, lon: 80.2341, heading: 180, status: 'DELAYED', occupancy: 'MODERATE', speed: 30, nextStops: [
    { stopId: 's3', stopName: 'Adyar Signal', eta: futureEta(5), status: 'DELAYED' },
    { stopId: 's4', stopName: 'Besant Nagar', eta: futureEta(12), status: 'ON_TIME' },
  ]},
  { id: 'v3', mode: 'METRO', routeId: 'Blue Line', lat: 13.0102, lon: 80.2158, heading: 220, status: 'ON_TIME', occupancy: 'SEATS_AVAILABLE', speed: 50, nextStops: [
    { stopId: 's5', stopName: 'Guindy', eta: futureEta(2), status: 'ON_TIME' },
    { stopId: 's6', stopName: 'Alandur', eta: futureEta(5), status: 'ON_TIME' },
  ]},
  { id: 'v4', mode: 'METRO', routeId: 'Green Line', lat: 13.0827, lon: 80.2707, heading: 0, status: 'ON_TIME', occupancy: 'MODERATE', speed: 45, nextStops: [
    { stopId: 's7', stopName: 'Central', eta: futureEta(1), status: 'ON_TIME' },
    { stopId: 's8', stopName: 'Egmore', eta: futureEta(4), status: 'ON_TIME' },
  ]},
  { id: 'v5', mode: 'TRAIN', routeId: 'MRTS', lat: 13.0330, lon: 80.2750, heading: 160, status: 'ON_TIME', occupancy: 'CROWDED', speed: 40, nextStops: [
    { stopId: 's9', stopName: 'Thiruvanmiyur', eta: futureEta(4), status: 'ON_TIME' },
    { stopId: 's10', stopName: 'Velachery', eta: futureEta(10), status: 'ON_TIME' },
  ]},
];

export const useStore = create(
  persist(
    (set, get) => ({
      // Real-time Vehicle State
      vehicles: mockVehicles,
      setVehicles: (vehicles) => set({ vehicles }),
      
      startMockSimulation: () => {
        setInterval(() => {
          const currentVehicles = get().vehicles;
          const updatedVehicles = currentVehicles.map(v => {
            let newLat = v.lat + (Math.random() - 0.5) * 0.002;
            let newLon = v.lon + (Math.random() - 0.5) * 0.002;
            let newHeading = (v.heading + (Math.random() - 0.5) * 10) % 360;
            let newStops = v.nextStops.map((s, i) => ({
              ...s,
              eta: Math.floor(Date.now() / 1000) + (i + 1) * (Math.floor(Math.random() * 3) + 2) * 60
            }));
            return { ...v, lat: newLat, lon: newLon, heading: newHeading, nextStops: newStops };
          });
          set({ vehicles: updatedVehicles });
        }, 3000);
      },

      // Global Search State
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // User Profile State
      user: null,
      authToken: null,
      
      login: async (email, password) => {
        set({ user: { id: 'test-user', name: 'Test User', email }, authToken: 'mock-token' });
      },
      
      register: async (name, email, password) => {
        set({ user: { id: 'test-user', name, email }, authToken: 'mock-token' });
      },

      fetchUser: async () => {
        // Mock user fetch
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
      logout: () => set({ user: null, authToken: null }),


      // Saved Routes (Home/Work/Custom)
      savedRoutes: [
        { id: '1', name: 'Home', routeId: '19B', mode: 'BUS' },
        { id: '2', name: 'Work', routeId: 'Blue Line', mode: 'METRO' }
      ],
      addSavedRoute: (route) => set((state) => ({ savedRoutes: [...state.savedRoutes, route] })),
      removeSavedRoute: (id) => set((state) => ({ savedRoutes: state.savedRoutes.filter(r => r.id !== id) })),

      // Alerts State
      activeAlerts: {},
      toggleAlert: (vehicleId, active) => set((state) => ({
        activeAlerts: { ...state.activeAlerts, [vehicleId]: active }
      })),

      selectedVehicle: null,
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
    }),
    {
      name: 'transit-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ savedRoutes: state.savedRoutes, activeAlerts: state.activeAlerts, user: state.user, authToken: state.authToken }),
    }
  )
);
