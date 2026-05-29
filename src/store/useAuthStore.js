// cspell:disable
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '@/lib/queryClient';

// Menyimpan token dan data user yang sedang login.
// Pakai persist middleware supaya data tetap ada setelah halaman di-refresh — disimpan ke localStorage dengan key 'auth-storage'.
//
// Hal penting: setiap kali login atau logout, cache TanStack Query selalu dibersihkan duluan.
// Tujuannya supaya data produk dari user sebelumnya tidak bocor ke user berikutnya
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
