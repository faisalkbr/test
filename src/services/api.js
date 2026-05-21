import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiFetch = async (endpoint, options = {}) => {
  const { token } = useAuthStore.getState();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // response without body — keep data as null
  }

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
