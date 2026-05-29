// cspell:disable
import { useAuthStore } from '@/store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Error khusus untuk respons non-2xx dari server.
// Menyimpan .status dan .data supaya komponen bisa handle kasus spesifik —
// misalnya tampilkan pesan "bukan pemilik produk" untuk 403, bukan pesan generik.
export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Baca body response dengan aman. Status 204 tidak punya body, langsung return null.
// Content-type di-cek dulu — kalau server mengembalikan HTML (halaman error Nginx/Vercel),
// kita tidak coba parse sebagai JSON supaya tidak throw SyntaxError yang membingungkan.
const parseBody = async (response) => {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};

// Alur setiap kali apiFetch dipanggil:
//
// 1. Ambil token dari Zustand store (pakai .getState() bukan hook karena ini bukan komponen React)
// 2. Susun headers — token diselipkan di Authorization kalau ada
// 3. Kirim request ke backend
// 4. Parse response body (lihat parseBody di atas)
// 5. Kalau status 401 dan bukan endpoint login → logout otomatis
//    (pengecualian login: supaya salah password tidak trigger logout)
// 6. Kalau response tidak ok → throw ApiError (komponen bisa cek .status untuk handle spesifik)
// 7. Kalau ok → return data
export const apiFetch = async (endpoint, { signal, ...options } = {}) => {
  const { token } = useAuthStore.getState();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    signal,
  });

  const data = await parseBody(response);

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    useAuthStore.getState().logout();
  }

  if (!response.ok) {
    const message =
      data?.message || data?.error || 'Terjadi kesalahan pada server.';
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
};
