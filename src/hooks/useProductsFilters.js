// cspell:disable
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

const SEARCH_DEBOUNCE_MS = 400;

// Alur saat user mengetik di search input:
//
//   1. setSearchInput dipanggil → update searchInput (state lokal, langsung)
//   2. useDebounce menunggu 400ms sejak ketikan terakhir → hasilnya debouncedSearch
//   3. useEffect deteksi debouncedSearch berubah → update URL (?search=..., page=1)
//   4. URL berubah → useProductsList di halaman list re-fetch dengan params baru
//
// Kenapa dipisah antara searchInput dan search (dari URL)?
// → Supaya URL tidak diupdate setiap keystroke. User ketik "laptop", URL cukup
//   update sekali setelah selesai — bukan tiap huruf l, la, lap, lapt, ...
//
// Alur saat user ganti sort / page / view:
//
//   1. setSortBy / setSortOrder / setPage / setView dipanggil
//   2. updateParam langsung update URL (tanpa debounce)
//   3. URL berubah → useProductsList re-fetch otomatis
export function useProductsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sort_by') ?? 'created_at';
  const sortOrder = searchParams.get('sort_order') ?? 'desc';
  const view = searchParams.get('view') === 'grid' ? 'grid' : 'table';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    // Guard: skip kalau nilai debounce sama dengan URL — cegah infinite loop.
    if (debouncedSearch === search) return;
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (debouncedSearch) params.set('search', debouncedSearch);
        else params.delete('search');
        params.set('page', '1');
        return params;
      },
      // replace: true → ketikan tidak masuk browser history, back button tidak aneh.
      { replace: true },
    );
  }, [debouncedSearch, search, setSearchParams]);

  const updateParam = (updater) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      updater(params);
      return params;
    });
  };

  return {
    search,
    sortBy,
    sortOrder,
    view,
    page,
    searchInput,
    setSearchInput,
    setSortBy: (v) =>
      updateParam((p) => {
        p.set('sort_by', v);
        p.set('page', '1');
      }),
    setSortOrder: (v) =>
      updateParam((p) => {
        p.set('sort_order', v);
        p.set('page', '1');
      }),
    setView: (v) =>
      updateParam((p) => {
        // 'table' adalah default — tidak perlu di URL, hapus saja supaya URL bersih.
        if (v === 'grid') p.set('view', 'grid');
        else p.delete('view');
      }),
    setPage: (n) => updateParam((p) => p.set('page', String(n))),
    clearSearch: () =>
      updateParam((p) => {
        p.delete('search');
        p.set('page', '1');
      }),
  };
}
