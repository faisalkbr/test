// cspell:disable
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch, ApiError } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

// Setelah register berhasil, user diarahkan ke halaman login — tidak auto-login.
// Backend tidak mengembalikan token setelah register, jadi harus login manual.
export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData) =>
      apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal melakukan registrasi.');
    },
  });
};

// Token divalidasi di dalam mutationFn sebelum disimpan ke store.
// Kalau server kirim response 200 tapi tanpa access_token, itu dianggap error —
// lebih aman throw ApiError eksplisit daripada menyimpan token null atau undefined.
// Error 401 mendapat pesan yang lebih spesifik daripada pesan generik dari server.
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      const token = response?.data?.access_token;
      const user = response?.data?.user;
      if (!token) {
        throw new ApiError('Server tidak mengembalikan token akses.', {
          status: 500,
          data: response,
        });
      }
      return { token, user };
    },
    onSuccess: ({ token, user }) => {
      setCredentials(token, user);
      toast.success('Login berhasil!');
      navigate('/products');
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
