import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create(
  persist(
    (set) => ({
      // Real-time Vehicle State
      vehicles: [],
      setVehicles: (vehicles) => set({ vehicles }),
      
      // Global Search State
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // User Profile State
      user: null,
      authToken: null,
      
      login: async (email, password) => {
        const res = await fetch('http://192.168.1.7:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        set({ user: data.user, authToken: data.token });
      },
      
      register: async (name, email, password) => {
        const res = await fetch('http://192.168.1.7:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        set({ user: data.user, authToken: data.token });
      },

      fetchUser: async () => {
        const state = useStore.getState();
        if (!state.authToken) return;
        try {
          const res = await fetch('http://192.168.1.7:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${state.authToken}` }
          });
          const data = await res.json();
          if (res.ok) {
            set({ user: data.user });
          } else {
            set({ user: null, authToken: null });
          }
        } catch (err) {
          console.error(err);
        }
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
