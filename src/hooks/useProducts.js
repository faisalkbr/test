import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { productsApi } from '@/services/products';
import { queryKeys } from '@/lib/queryKeys';

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

export const useProductDetail = (id) =>
  useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.detail(id),
    enabled: Boolean(id),
    select: (res) => res?.data ?? res,
  });

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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};

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

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};
