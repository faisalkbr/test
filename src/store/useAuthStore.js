// cspell:disable
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '@/lib/queryClient';

// useAuthStore adalah Zustand store yang menyimpan token dan data user yang sedang login.
// persist middleware membuat data tetap ada setelah refresh — disimpan ke localStorage dengan key 'auth-storage'.
//
// Hal penting: setCredentials dan logout keduanya membersihkan cache TanStack Query lebih dulu.
// Tujuannya agar data produk dari user sebelumnya tidak bocor ke user berikutnya
// di browser yang sama — terutama kalau dipakai bergantian di satu komputer.
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
