export const queryKeys = {
  products: {
    all: ['products'],
    lists: () => [...queryKeys.products.all, 'list'],
    list: (params) => [...queryKeys.products.lists(), params],
    details: () => [...queryKeys.products.all, 'detail'],
    detail: (id) => [...queryKeys.products.details(), id],
  },
};
