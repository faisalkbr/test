import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

const SEARCH_DEBOUNCE_MS = 400;

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
    if (debouncedSearch === search) return;
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (debouncedSearch) params.set('search', debouncedSearch);
        else params.delete('search');
        params.set('page', '1');
        return params;
      },
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

