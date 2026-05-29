// cspell:disable
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { productsApi } from '@/services/products';
import { queryKeys } from '@/lib/queryKeys';

// Ambil daftar produk dari server. Kalau cache masih fresh, data langsung dipakai tanpa fetch ulang.
// Saat filter atau halaman berubah, data lama tetap tampil dulu sampai data baru siap — supaya tidak berkedip.
// Response dari server di-transform supaya komponen selalu dapat bentuk { items, pagination }.
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

// Ambil detail satu produk berdasarkan id.
// Tidak akan fetch kalau id belum ada — misalnya saat modal edit belum dibuka.
export const useProductDetail = (id) =>
  useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.detail(id),
    enabled: Boolean(id),
    select: (res) => res?.data ?? res,
  });

// Dipanggil saat user hover produk di halaman list.
// Data detail langsung di-fetch di background dan masuk ke cache.
// Jadi saat user klik dan masuk ke halaman detail, data sudah siap — tidak ada loading.
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

// Buat produk baru. Setelah berhasil, daftar produk otomatis di-refresh
// supaya produk yang baru dibuat langsung muncul di list.
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};

// Update produk dengan optimistic update — UI langsung berubah sebelum server merespons.
//
// Urutannya begini:
// 1. Sebelum request dikirim (onMutate): batalkan query yang sedang berjalan,
//    simpan data lama sebagai cadangan, lalu langsung update tampilan.
// 2. Kalau server gagal (onError): kembalikan tampilan ke data cadangan tadi.
// 3. Setelah selesai, sukses maupun gagal (onSettled): paksa refresh dari server
//    supaya data di cache benar-benar sinkron dengan kondisi server.
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

// Hapus produk. Setelah berhasil, list di-refresh supaya produk yang dihapus hilang dari tampilan.
// Cache detail tidak perlu diurus — halaman detail tidak akan diakses lagi setelah produk dihapus.
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};
