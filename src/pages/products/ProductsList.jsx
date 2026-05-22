import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProductsList } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency } from '../../lib/formatCurrency';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import { ProductAvatar } from '../../components/Avatar';
import { Icons, Spinner } from '../../components/icons';
import EditProductModal from '../../components/products/EditProductModal';
import DeleteProductDialog from '../../components/products/DeleteProductDialog';

const PAGE_SIZE = 10;
const SKELETON_ROWS = 6;

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Tanggal Dibuat' },
  { value: 'name', label: 'Nama' },
];

function FilterBar({
  searchInput,
  onSearchInput,
  sortBy,
  onSortBy,
  sortOrder,
  onSortOrder,
  view,
  onView,
  total,
  isFetching,
}) {
  return (
    <div className="bg-paper border border-ink-150 rounded-xl p-3 flex gap-2.5 items-center flex-wrap shadow-[0_1px_0_rgba(10,11,10,0.04)]">
      <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-ink-50 rounded-lg px-3 h-[38px]">
        <span className="inline-flex text-ink-400">
          <Icons.search size={16} />
        </span>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => onSearchInput(e.target.value)}
          placeholder="Cari produk berdasarkan nama…"
          className="flex-1 border-0 outline-none bg-transparent text-[13.5px] text-ink-900 placeholder:text-ink-400"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => onSearchInput('')}
            aria-label="Hapus pencarian"
            className="inline-flex p-0.5 text-ink-500 hover:text-ink-900 cursor-pointer"
          >
            <Icons.close size={14} />
          </button>
        )}
      </div>

      <div className="w-px h-6 bg-ink-150" />

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortBy(e.target.value)}
          aria-label="Urutkan berdasarkan"
          className="appearance-none h-[38px] pl-9 pr-9 rounded-lg bg-paper border border-ink-200 text-ink-700 text-[13px] cursor-pointer focus:outline-none focus:border-ink-900"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Urut: {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
          <Icons.sort size={14} />
        </span>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400">
          <Icons.chevDown size={14} />
        </span>
      </div>

      <button
        type="button"
        onClick={() => onSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        title={sortOrder === 'desc' ? 'Terbaru ke terlama' : 'Terlama ke terbaru'}
        className="h-[38px] px-3 rounded-lg bg-paper border border-ink-200 text-ink-700 text-[13px] cursor-pointer inline-flex items-center gap-1.5 hover:bg-ink-50"
      >
        <span
          style={{
            transform: sortOrder === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform .2s',
          }}
        >
          <Icons.sort size={14} />
        </span>
        {sortOrder === 'desc' ? 'Desc' : 'Asc'}
      </button>

      <div className="flex-1" />

      <div className="inline-flex bg-ink-50 rounded-lg p-0.5">
        {[
          { v: 'table', icon: <Icons.list size={15} />, label: 'Tabel' },
          { v: 'grid', icon: <Icons.grid size={15} />, label: 'Kartu' },
        ].map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onView(o.v)}
            aria-pressed={view === o.v}
            title={o.label}
            className={[
              'px-2.5 py-1.5 rounded-md inline-flex items-center gap-1.5 text-[12.5px] font-medium cursor-pointer',
              view === o.v
                ? 'bg-paper shadow-[0_1px_0_rgba(10,11,10,0.04)] text-ink-900'
                : 'bg-transparent text-ink-500 hover:text-ink-700',
            ].join(' ')}
          >
            {o.icon}
          </button>
        ))}
      </div>

      <div className="inline-flex items-center gap-1.5 text-ink-500 text-xs pl-1.5">
        {isFetching && <Spinner size={12} />}
        <span className="font-mono">{total} item</span>
      </div>
    </div>
  );
}

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-ink-50 transition-colors group cursor-pointer">
      <td className="px-[18px] py-3.5 align-middle">
        <Link
          to={`/products/${product.id}`}
          className="font-mono text-xs text-ink-500 no-underline hover:text-ink-900"
        >
          {String(product.id).slice(0, 12)}
        </Link>
      </td>
      <td className="px-[18px] py-3.5 align-middle">
        <Link
          to={`/products/${product.id}`}
          className="flex items-center gap-3 no-underline"
        >
          <ProductAvatar name={product.name} />
          <span className="font-medium text-ink-950">{product.name}</span>
        </Link>
      </td>
      <td className="px-[18px] py-3.5 align-middle text-right">
        <span className="font-mono font-medium text-ink-950">
          {formatCurrency(product.price)}
        </span>
      </td>
      <td className="px-[18px] py-3.5 align-middle text-right">
        <div className="inline-flex gap-1 opacity-45 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product.id);
            }}
            aria-label={`Edit ${product.name}`}
            className="inline-flex p-1.5 rounded-md text-ink-700 hover:bg-ink-100 cursor-pointer"
          >
            <Icons.edit size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product);
            }}
            aria-label={`Hapus ${product.name}`}
            className="inline-flex p-1.5 rounded-md text-ink-700 hover:bg-danger-50 hover:text-danger-600 cursor-pointer"
          >
            <Icons.trash size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ProductsTable({ items, onEdit, onDelete }) {
  return (
    <div className="bg-paper border border-ink-150 rounded-xl overflow-hidden shadow-[0_1px_0_rgba(10,11,10,0.04)]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-ink-50 border-b border-ink-150">
            <th className="px-[18px] py-3 text-left text-[11.5px] font-medium tracking-[0.06em] uppercase text-ink-500 w-[140px]">
              ID
            </th>
            <th className="px-[18px] py-3 text-left text-[11.5px] font-medium tracking-[0.06em] uppercase text-ink-500">
              Nama Produk
            </th>
            <th className="px-[18px] py-3 text-right text-[11.5px] font-medium tracking-[0.06em] uppercase text-ink-500">
              Harga
            </th>
            <th className="px-[18px] py-3 text-right text-[11.5px] font-medium tracking-[0.06em] uppercase text-ink-500 w-[140px]">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((p, i) => (
            <ProductRow
              key={p.id}
              product={p}
              onEdit={onEdit}
              onDelete={onDelete}
              isLast={i === items.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsGrid({ items, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
      {items.map((p) => {
        const idTail = String(p.id).slice(-2).toUpperCase();
        return (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="bg-paper border border-ink-150 rounded-xl p-4 flex flex-col gap-3 transition-all shadow-[0_1px_0_rgba(10,11,10,0.04)] hover:shadow-[0_2px_4px_rgba(10,11,10,0.04),0_6px_16px_-4px_rgba(10,11,10,0.06)] hover:-translate-y-px no-underline text-inherit"
          >
            <div
              className="h-[88px] rounded-lg border border-ink-100 relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-brand-50), var(--color-paper))',
              }}
            >
              <span
                className="font-mono absolute -right-3 -bottom-4 font-semibold text-brand-700"
                style={{
                  fontSize: 80,
                  opacity: 0.22,
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                }}
              >
                {idTail}
              </span>
            </div>
            <div>
              <span className="font-mono text-[11px] text-ink-400">
                {String(p.id).slice(0, 12)}
              </span>
              <div className="text-[14.5px] font-medium text-ink-950 mt-0.5 leading-[1.3]">
                {p.name}
              </div>
            </div>
            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="eyebrow">Harga</div>
                <div className="font-mono text-base font-medium text-ink-950 mt-0.5">
                  {formatCurrency(p.price)}
                </div>
              </div>
              <div className="inline-flex gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(p.id);
                  }}
                  aria-label={`Edit ${p.name}`}
                  className="inline-flex p-1.5 rounded-md text-ink-700 hover:bg-ink-100 cursor-pointer"
                >
                  <Icons.edit size={15} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(p);
                  }}
                  aria-label={`Hapus ${p.name}`}
                  className="inline-flex p-1.5 rounded-md text-ink-700 hover:bg-danger-50 hover:text-danger-600 cursor-pointer"
                >
                  <Icons.trash size={15} />
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function EmptyState({ search, onClear }) {
  return (
    <div className="bg-paper border border-dashed border-ink-200 rounded-xl py-16 px-6 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-[14px] bg-ink-50 text-ink-500 mb-4">
        {search ? <Icons.search size={22} /> : <Icons.box size={22} />}
      </div>
      <h3 className="m-0 text-[17px] font-medium text-ink-950">
        {search
          ? `Tidak ada hasil untuk "${search}"`
          : 'Belum ada produk dalam katalog'}
      </h3>
      <p className="text-[13.5px] text-ink-500 mt-1.5 mb-[18px]">
        {search
          ? 'Coba kata kunci lain atau periksa ejaan.'
          : 'Tambahkan produk pertama untuk mulai menjual layanan konsultasi.'}
      </p>
      {search ? (
        <Button variant="secondary" onClick={onClear}>
          Hapus pencarian
        </Button>
      ) : (
        <Link to="/products/new">
          <Button variant="accent" leading={<Icons.plus size={14} />}>
            Tambah produk pertama
          </Button>
        </Link>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-paper border border-ink-150 rounded-xl overflow-hidden">
      <div className="bg-ink-50 border-b border-ink-150 px-[18px] py-3 h-[42px]" />
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-[18px] py-3.5 border-b border-ink-100 last:border-b-0 animate-pulse"
        >
          <div className="h-4 bg-ink-100 rounded w-24" />
          <div className="h-7 w-7 bg-ink-100 rounded-md" />
          <div className="h-4 bg-ink-100 rounded flex-1 max-w-[280px]" />
          <div className="ml-auto h-4 bg-ink-100 rounded w-28" />
          <div className="h-7 bg-ink-100 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export default function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sort_by') ?? 'created_at';
  const sortOrder = searchParams.get('sort_order') ?? 'desc';
  const view = searchParams.get('view') === 'grid' ? 'grid' : 'table';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;
  const total = pagination?.total ?? items.length;
  const currentPage = pagination?.page ?? page;

  const updateParam = (updater) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      updater(params);
      return params;
    });
  };

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
          searchInput={searchInput}
          onSearchInput={setSearchInput}
          sortBy={sortBy}
          onSortBy={(v) =>
            updateParam((p) => {
              p.set('sort_by', v);
              p.set('page', '1');
            })
          }
          sortOrder={sortOrder}
          onSortOrder={(v) =>
            updateParam((p) => {
              p.set('sort_order', v);
              p.set('page', '1');
            })
          }
          view={view}
          onView={(v) =>
            updateParam((p) => {
              if (v === 'grid') p.set('view', 'grid');
              else p.delete('view');
            })
          }
          total={total}
          isFetching={isFetching}
        />

        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="bg-paper border border-danger-600 rounded-xl p-6 text-danger-600">
            {error?.message || 'Gagal memuat produk'}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            search={search}
            onClear={() =>
              updateParam((p) => {
                p.delete('search');
                p.set('page', '1');
              })
            }
          />
        ) : view === 'table' ? (
          <ProductsTable
            items={items}
            onEdit={setEditId}
            onDelete={setDeleteTarget}
          />
        ) : (
          <ProductsGrid
            items={items}
            onEdit={setEditId}
            onDelete={setDeleteTarget}
          />
        )}

        {pagination && totalPages > 1 && (
          <div className="flex justify-between items-center text-[13px] text-ink-500">
            <span>
              Halaman{' '}
              <strong className="text-ink-900">{currentPage}</strong> dari{' '}
              <strong className="text-ink-900">{totalPages}</strong> · {total} produk
              {isFetching && !isLoading && ' · memuat…'}
            </span>
            <div className="flex gap-1.5 items-center">
              <Button
                size="sm"
                variant="secondary"
                leading={<Icons.chevLeft size={14} />}
                disabled={currentPage <= 1 || isFetching}
                onClick={() =>
                  updateParam((p) => p.set('page', String(currentPage - 1)))
                }
              >
                Sebelumnya
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === currentPage;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        updateParam((p) => p.set('page', String(n)))
                      }
                      className={[
                        'w-8 h-8 rounded-lg text-[13px] font-medium cursor-pointer',
                        active
                          ? 'bg-ink-950 text-white'
                          : 'bg-transparent text-ink-700 hover:bg-ink-100',
                      ].join(' ')}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <Button
                size="sm"
                variant="secondary"
                trailing={<Icons.chevRight size={14} />}
                disabled={currentPage >= totalPages || isFetching}
                onClick={() =>
                  updateParam((p) => p.set('page', String(currentPage + 1)))
                }
              >
                Berikutnya
              </Button>
            </div>
          </div>
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
