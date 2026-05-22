 import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '../lib/queryClient';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setCredentials: (token, user = null) => {
        queryClient.clear();
        set({ token, user });
      },

      logout: () => {
        queryClient.clear();
        set({ token: null, user: null });
      },
    }),
    { name: 'auth-storage' },
  ),
);
