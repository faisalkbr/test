// cspell:disable
import { useAuthStore } from '@/store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// ApiError adalah custom Error class untuk respons non-2xx dari server.
// Menyimpan .status dan .data sehingga komponen bisa menangani kasus tertentu —
// misalnya tampilkan pesan khusus untuk 403, bukan pesan generik.
export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// parseBody membaca body response dengan aman.
// Status 204 tidak punya body sehingga langsung return null.
// Content-type di-cek lebih dulu — kalau server mengembalikan HTML (halaman error Nginx/Vercel),
// tidak akan ada percobaan parse JSON yang menghasilkan SyntaxError membingungkan.
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

// apiFetch adalah satu-satunya HTTP utility di aplikasi ini. Alurnya setiap kali dipanggil:
// 1. Token diambil dari Zustand store lewat .getState() — bukan hook karena ini bukan komponen React
// 2. Headers disusun dengan token di Authorization kalau ada
// 3. Request dikirim ke backend
// 4. Body response diparse via parseBody (lihat fungsi di atas)
// 5. Status 401 di luar endpoint login memicu auto-logout
//    (pengecualian login supaya salah password tidak langsung trigger logout)
// 6. Response non-ok melempar ApiError dengan .status dan .data untuk penanganan spesifik
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
