import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

// 1. Hook untuk Register
export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData) => {
      return await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
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
      const token = data?.data?.access_token;
      const user = data?.data?.user;

      if (token) {
        setCredentials(token, user);
        toast.success('Login berhasil!');
        navigate('/products');
      } else {
        toast.error('Gagal mengambil token dari server.');
      }
    },
    onError: (error) => {
      if (error.status === 401) {
        toast.error('Email atau password salah');
      } else {
        toast.error(error.message || 'Terjadi kesalahan saat login.');
      }
    },
  });
};