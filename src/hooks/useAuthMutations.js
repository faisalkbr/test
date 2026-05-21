// src/hooks/useAuthMutations.js
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

// 1. Hook untuk Register
export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    // V5 syntax: mutationFn wajib menerima satu argumen objek/variabel
    mutationFn: async (userData) => {
      return await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login'); // Lempar ke halaman login setelah sukses
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal melakukan registrasi.');
    },
  });
};

// 2. Hook untuk Login
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  return useMutation({
    mutationFn: async (credentials) => {
      return await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data) => {
      // Sesuai struktur response JSON yang kita bedah sebelumnya
      const token = data?.data?.access_token;
      const user = data?.data?.user;

      if (token) {
        setCredentials(token, user); // Simpan ke Zustand & LocalStorage
        toast.success('Login berhasil!');
        navigate('/products'); // Lempar ke dashboard
      } else {
        toast.error('Gagal mengambil token dari server.');
      }
    },
    onError: (error) => {
      // Jika status 401, tampilkan error spesifik sesuai test case
      if (error.status === 401) {
        toast.error('Email atau password salah');
      } else {
        toast.error(error.message || 'Terjadi kesalahan saat login.');
      }
    },
  });
};