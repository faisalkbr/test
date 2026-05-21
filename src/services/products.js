import { apiFetch } from './api';

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
