// cspell:disable

// queryKeys adalah objek yang berisi factory function untuk semua query key di aplikasi ini.
// Strukturnya hierarkis sehingga invalidasi bisa selektif:
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
