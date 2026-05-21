import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { productsApi } from '../services/products';
import { queryKeys } from '../lib/queryKeys';

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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
};

export const useUpdateProduct = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
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
