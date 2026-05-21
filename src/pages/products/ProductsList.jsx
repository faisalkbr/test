import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProductsList, useDeleteProduct } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency } from '../../lib/formatCurrency';
import Button from '../../components/Button';
import EditProductModal from '../../components/products/EditProductModal';

const PAGE_SIZE = 10;
const SKELETON_ROWS = 5;

const SORT_BY_OPTIONS = [
  { value: 'created_at', label: 'Tanggal Dibuat' },
  { value: 'name', label: 'Nama' },
];

const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export default function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sort_by') ?? 'created_at';
  const sortOrder = searchParams.get('sort_order') ?? 'desc';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [editId, setEditId] = useState(null);
  const debouncedSearch = useDebounce(searchInput, 400);

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

  const { data, isLoading, isError, error, isFetching } = useProductsList({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const deleteMutation = useDeleteProduct();

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages ?? pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? page;

  const updateParam = (updater) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      updater(params);
      return params;
    });
  };

  const goToPage = (next) => {
    updateParam((params) => params.set('page', String(next)));
  };

  const handleSortChange = (key) => (event) => {
    const value = event.target.value;
    updateParam((params) => {
      params.set(key, value);
      params.set('page', '1');
    });
  };

  const handleDelete = (product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
    deleteMutation.mutate(product.id, {
      onSuccess: () => toast.success('Produk berhasil dihapus'),
      onError: (err) =>
        toast.error(err.message || 'Gagal menghapus produk'),
    });
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <header className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manajemen Produk</h2>
              <p className="text-sm text-gray-500">
                Kelola seluruh produk yang tersedia.
              </p>
            </div>
            <Link to="/products/new">
              <Button>+ Tambah Produk</Button>
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Cari nama produk..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={sortBy}
              onChange={handleSortChange('sort_by')}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Urutkan berdasarkan"
            >
              {SORT_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Urut: {opt.label}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={handleSortChange('sort_order')}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Arah pengurutan"
            >
              {SORT_ORDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3 ml-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex gap-2 float-right">
                        <div className="h-7 bg-gray-200 rounded w-12" />
                        <div className="h-7 bg-gray-200 rounded w-14" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-red-600">
                    {error?.message || 'Gagal memuat produk'}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                    {search
                      ? `Tidak ada produk yang cocok dengan "${search}"`
                      : 'Belum ada produk. Klik "Tambah Produk" untuk membuat.'}
                  </td>
                </tr>
              ) : (
                items.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <Link
                        to={`/products/${product.id}`}
                        className="hover:text-blue-600"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditId(product.id)}
                          aria-label={`Edit ${product.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          disabled={
                            deleteMutation.isPending &&
                            deleteMutation.variables === product.id
                          }
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <footer className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
              {pagination.total != null && ` • ${pagination.total} produk`}
              {isFetching && !isLoading && ' • memuat...'}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => goToPage(currentPage - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages || isFetching}
                onClick={() => goToPage(currentPage + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </footer>
        )}
      </div>

      <EditProductModal productId={editId} onClose={() => setEditId(null)} />
    </>
  );
}
