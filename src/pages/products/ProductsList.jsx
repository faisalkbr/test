import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductsList } from '@/hooks/useProducts';
import { useProductsFilters } from '@/hooks/useProductsFilters';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import { Icons } from '@/components/icons';
import EditProductModal from '@/components/products/EditProductModal';
import DeleteProductDialog from '@/components/products/DeleteProductDialog';
import FilterBar from './components/FilterBar';
import ProductsTable from './components/ProductsTable';
import ProductsGrid from './components/ProductsGrid';
import EmptyState from './components/EmptyState';
import TableSkeleton from './components/TableSkeleton';
import Pagination from './components/Pagination';

const PAGE_SIZE = 10;

function ProductsContent({ query, view, search, onEdit, onDelete, onClearSearch }) {
  if (query.isLoading) return <TableSkeleton />;

  if (query.isError) {
    return (
      <div className="bg-paper border border-danger-600 rounded-xl p-6 text-danger-600">
        {query.error?.message || 'Gagal memuat produk'}
      </div>
    );
  }

  if (query.items.length === 0) {
    return <EmptyState search={search} onClear={onClearSearch} />;
  }

  const ListView = view === 'grid' ? ProductsGrid : ProductsTable;
  return <ListView items={query.items} onEdit={onEdit} onDelete={onDelete} />;
}

export default function ProductsList() {
  const filters = useProductsFilters();
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, error, isFetching } = useProductsList({
    page: filters.page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;
  const total = pagination?.total ?? items.length;
  const currentPage = pagination?.page ?? filters.page;
  const showPagination = pagination && totalPages > 1;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'Workspace' }, { label: 'Produk & Layanan' }]}
        title="Produk & Layanan"
        description="Katalog layanan konsultasi 180DC UNAIR yang ditawarkan kepada mitra. Kelola harga dan sesuaikan penawaran."
        actions={
          <Link to="/products/new">
            <Button variant="accent" leading={<Icons.plus size={14} />}>
              Tambah Produk
            </Button>
          </Link>
        }
      />

      <div className="px-10 pt-5 pb-10 flex flex-col gap-4">
        <FilterBar
          searchInput={filters.searchInput}
          onSearchInput={filters.setSearchInput}
          sortBy={filters.sortBy}
          onSortBy={filters.setSortBy}
          sortOrder={filters.sortOrder}
          onSortOrder={filters.setSortOrder}
          view={filters.view}
          onView={filters.setView}
          total={total}
          isFetching={isFetching}
        />

        <ProductsContent
          query={{ isLoading, isError, error, items }}
          view={filters.view}
          search={filters.search}
          onEdit={setEditId}
          onDelete={setDeleteTarget}
          onClearSearch={filters.clearSearch}
        />

        {showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            isFetching={isFetching && !isLoading}
            onPageChange={filters.setPage}
          />
        )}
      </div>

      <EditProductModal productId={editId} onClose={() => setEditId(null)} />
      <DeleteProductDialog
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
