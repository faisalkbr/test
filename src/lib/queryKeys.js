// cspell:disable

// Factory untuk semua query key TanStack Query di aplikasi ini.
// Pola hierarkis memungkinkan invalidasi selektif:
// - queryKeys.products.all     → bersihkan semua cache produk sekaligus
// - queryKeys.products.lists() → hanya cache daftar, tanpa menyentuh cache detail
// - queryKeys.products.detail(id) → hanya cache satu produk tertentu
export const queryKeys = {
  products: {
    all: ['products'],
    lists: () => [...queryKeys.products.all, 'list'],
    list: (params) => [...queryKeys.products.lists(), params],
    details: () => [...queryKeys.products.all, 'detail'],
    detail: (id) => [...queryKeys.products.details(), id],
  },
};
