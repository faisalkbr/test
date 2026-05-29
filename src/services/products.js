// cspell:disable
import { apiFetch } from './api';

// Membangun query string dari object params, tapi hanya menyertakan key yang punya nilai.
// undefined, null, dan string kosong dilewati — tidak ingin kirim ?search=&sort_by= ke backend.
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

// Semua request produk terpusat di sini. Tidak ada fetch langsung dari komponen atau hook —
// selalu lewat productsApi → apiFetch, yang sudah mengurus auth header dan error parsing.
// Method `update` pakai PATCH bukan PUT: hanya field yang berubah yang dikirim ke server.
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
