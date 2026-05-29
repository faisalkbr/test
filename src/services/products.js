// cspell:disable
import { apiFetch } from './api';

// buildQuery adalah fungsi yang membangun query string dari object params.
// Hanya key yang punya nilai yang disertakan — undefined, null, dan string kosong dilewati
// agar tidak ada param kosong seperti ?search=&sort_by= yang terkirim ke backend.
const buildQuery = (params) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      usp.append(key, String(value));
    }
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
};

// productsApi adalah objek yang berisi semua method CRUD untuk resource produk.
// Semua fetch produk lewat sini — tidak ada fetch langsung dari komponen atau hook —
// sehingga auth header dan error parsing sudah diurus oleh apiFetch secara terpusat.
// Method update menggunakan PATCH bukan PUT: hanya field yang berubah yang dikirim ke server.
export const productsApi = {
  list: ({
    page = 1,
    limit = 10,
    search,
    sort_by,
    sort_order,
  } = {}) =>
    apiFetch(
      `/products/${buildQuery({ page, limit, search, sort_by, sort_order })}`,
    ),

  detail: (id) => apiFetch(`/products/${id}`),

  create: (data) =>
    apiFetch('/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id) =>
    apiFetch(`/products/${id}`, {
      method: 'DELETE',
    }),
};
