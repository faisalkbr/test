// cspell:disable
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { productsApi } from '@/services/products';
import { queryKeys } from '@/lib/queryKeys';

// useProductsList adalah hook yang mengambil daftar produk dari server.
// Data lama tetap tampil saat filter/halaman berubah sampai data baru siap, agar tidak berkedip.
// Response di-transform via select sehingga komponen selalu mendapat bentuk { items, pagination }.
export const useProductsList = (params = {}) =>
  useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.list(params),
    placeholderData: keepPreviousData,
    select: (res) => ({
      items: Array.isArray(res?.data) ? res.data : [],
      pagination: res?.pagination ?? null,
    }),
  });

// useProductDetail adalah hook yang mengambil detail satu produk berdasarkan id.
// Query tidak aktif kalau id belum ada — misalnya saat modal edit belum dibuka.
export const useProductDetail = (id) =>
  useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.detail(id),
    enabled: Boolean(id),
    select: (res) => res?.data ?? res,
  });

// usePrefetchProductDetail adalah hook yang mengembalikan fungsi prefetch untuk detail produk.
// Fungsi ini dipanggil saat user hover di halaman list — data masuk ke cache di background
// sehingga halaman detail muncul instan tanpa loading saat diklik.
export const usePrefetchProductDetail = () => {
  const queryClient = useQueryClient();
  return (id) => {
    if (!id) return;
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => productsApi.detail(id),
    });
  };
};

// useCreateProduct adalah mutation hook untuk membuat produk baru.
// Setelah berhasil, cache daftar produk di-invalidate agar produk baru langsung muncul di list.
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};

// useUpdateProduct adalah mutation hook untuk mengubah data produk dengan optimistic update —
// UI berubah dulu sebelum server merespons.
//
// Alurnya:
// 1. onMutate: query aktif dibatalkan, data lama disimpan sebagai cadangan, tampilan langsung diupdate.
// 2. onError: tampilan dikembalikan ke data cadangan kalau server gagal.
// 3. onSettled: cache di-invalidate setelah selesai (sukses maupun gagal) agar sinkron dengan server.
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),

    onMutate: async ({ id, data }) => {
      const detailKey = queryKeys.products.detail(id);
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousDetail = queryClient.getQueryData(detailKey);

      if (previousDetail) {
        queryClient.setQueryData(detailKey, (old) => {
          if (!old) return old;
          if (old.data) return { ...old, data: { ...old.data, ...data } };
          return { ...old, ...data };
        });
      }

      return { previousDetail };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.products.detail(id),
          context.previousDetail,
        );
      }
    },

    onSettled: (_res, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};

// useDeleteProduct adalah mutation hook untuk menghapus produk.
// Setelah berhasil, cache daftar di-invalidate agar produk yang dihapus hilang dari tampilan.
// Cache detail tidak perlu diurus karena halaman detail tidak akan diakses lagi setelah produk dihapus.
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};
