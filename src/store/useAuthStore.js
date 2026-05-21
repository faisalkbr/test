// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // State awal
      token: null,
      user: null, // Opsional: sangat berguna untuk menampilkan nama/email di Dashboard

      // Action: Dipanggil saat request login mengembalikan status 200 OK
      setCredentials: (token, user = null) => set({ token, user }),

      // Action: Dipanggil saat user klik tombol Keluar, atau saat API merespons 401 Unauthorized
      logout: () => set({ token: null, user: null }),
    }),
    {
      // Konfigurasi Persist
      name: 'auth-storage', // Nama key yang akan muncul di Application > Local Storage browser
    }
  )
);