// cspell:disable
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch, ApiError } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

// useRegisterMutation adalah mutation hook untuk proses registrasi akun baru.
// Setelah berhasil, user diarahkan ke halaman login — tidak auto-login karena
// backend tidak mengembalikan token setelah register.
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

// useLoginMutation adalah mutation hook untuk proses login.
// Token divalidasi di dalam mutationFn sebelum disimpan ke store —
// kalau server kirim 200 tapi tanpa access_token, hook ini melempar ApiError eksplisit
// daripada menyimpan token kosong. Error 401 mendapat pesan yang lebih spesifik dari server.
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
